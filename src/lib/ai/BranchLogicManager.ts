import { Story, Scene, Choice, StoryProgress } from '@/models/Story';

/**
 * Branch Logic Manager
 * 
 * Handles complex conditional branches and variable tracking.
 * Manages the narrative flow based on user choices and story state.
 */
export interface BranchCondition {
  variableName: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not-contains';
  value: any;
}

export interface ConditionalBranch {
  conditions: BranchCondition[];
  nextSceneId: string;
  logicOperator: 'AND' | 'OR';
}

export interface EnhancedChoice extends Choice {
  conditionalBranches?: ConditionalBranch[];
  defaultNextSceneId?: string;
}

export class BranchLogicManager {
  /**
   * Evaluates a condition against the current story variables
   */
  private evaluateCondition(condition: BranchCondition, variables: Record<string, any>): boolean {
    const { variableName, operator, value } = condition;
    const variableValue = variables[variableName];
    
    // If variable doesn't exist, condition is false
    if (variableValue === undefined) {
      return false;
    }
    
    switch (operator) {
      case '==':
        return variableValue === value;
      case '!=':
        return variableValue !== value;
      case '>':
        return variableValue > value;
      case '<':
        return variableValue < value;
      case '>=':
        return variableValue >= value;
      case '<=':
        return variableValue <= value;
      case 'contains':
        if (Array.isArray(variableValue)) {
          return variableValue.includes(value);
        }
        if (typeof variableValue === 'string') {
          return variableValue.includes(String(value));
        }
        return false;
      case 'not-contains':
        if (Array.isArray(variableValue)) {
          return !variableValue.includes(value);
        }
        if (typeof variableValue === 'string') {
          return !variableValue.includes(String(value));
        }
        return true;
      default:
        return false;
    }
  }
  
  /**
   * Evaluates a conditional branch against the current story variables
   */
  private evaluateConditionalBranch(
    branch: ConditionalBranch,
    variables: Record<string, any>
  ): boolean {
    if (branch.conditions.length === 0) {
      return true; // No conditions means always true
    }
    
    if (branch.logicOperator === 'AND') {
      return branch.conditions.every(condition => 
        this.evaluateCondition(condition, variables)
      );
    } else { // OR
      return branch.conditions.some(condition => 
        this.evaluateCondition(condition, variables)
      );
    }
  }
  
  /**
   * Determines the next scene based on choice and story state
   */
  determineNextScene(
    choice: EnhancedChoice,
    progress: StoryProgress
  ): string {
    // If there are conditional branches, evaluate them
    if (choice.conditionalBranches && choice.conditionalBranches.length > 0) {
      for (const branch of choice.conditionalBranches) {
        if (this.evaluateConditionalBranch(branch, progress.variables)) {
          return branch.nextSceneId;
        }
      }
    }
    
    // If no conditional branches matched or none exist, use the default
    return choice.defaultNextSceneId || choice.nextSceneId;
  }
  
  /**
   * Updates story variables based on choice consequences
   */
  updateVariables(
    choice: Choice,
    currentVariables: Record<string, any>
  ): Record<string, any> {
    if (!choice.consequences || !choice.consequences.variableChanges) {
      return currentVariables;
    }
    
    return {
      ...currentVariables,
      ...choice.consequences.variableChanges
    };
  }
  
  /**
   * Checks if a choice is available based on requirements
   */
  isChoiceAvailable(
    choice: Choice,
    progress: StoryProgress
  ): boolean {
    // Check token requirements
    if (choice.requiredTokens && choice.requiredTokens > 0) {
      // In a real implementation, this would check the user's token balance
      // For now, we'll just assume they have enough
      return true;
    }
    
    // Additional requirements could be checked here
    
    return true;
  }
  
  /**
   * Finds all possible paths from a starting scene
   */
  findAllPaths(
    story: Story,
    startingSceneId: string = story.startingSceneId,
    maxDepth: number = 10
  ): Array<string[]> {
    const paths: Array<string[]> = [];
    
    const explore = (
      currentSceneId: string,
      currentPath: string[] = [],
      depth: number = 0
    ) => {
      // Prevent infinite loops and excessive depth
      if (depth > maxDepth || currentPath.includes(currentSceneId)) {
        paths.push([...currentPath, currentSceneId, '...']);
        return;
      }
      
      const scene = story.scenes[currentSceneId];
      if (!scene) {
        paths.push([...currentPath, currentSceneId, 'INVALID_SCENE']);
        return;
      }
      
      const newPath = [...currentPath, currentSceneId];
      
      // If no choices, this is an ending
      if (!scene.choices || scene.choices.length === 0) {
        paths.push(newPath);
        return;
      }
      
      // Explore each choice
      for (const choice of scene.choices) {
        explore(choice.nextSceneId, newPath, depth + 1);
      }
    };
    
    explore(startingSceneId);
    return paths;
  }
  
  /**
   * Analyzes a story for potential issues in branch logic
   */
  analyzeStoryLogic(story: Story): Record<string, any> {
    const issues: Record<string, any> = {
      unreachableScenes: [],
      deadEnds: [],
      missingScenes: [],
      circularPaths: []
    };
    
    // Find all scene IDs
    const allSceneIds = Object.keys(story.scenes);
    
    // Find all reachable scenes from the starting point
    const paths = this.findAllPaths(story);
    const reachableScenes = new Set<string>();
    
    paths.forEach(path => {
      path.forEach(sceneId => {
        if (sceneId !== '...' && sceneId !== 'INVALID_SCENE') {
          reachableScenes.add(sceneId);
        }
      });
    });
    
    // Find unreachable scenes
    issues.unreachableScenes = allSceneIds.filter(id => !reachableScenes.has(id));
    
    // Find dead ends (scenes with no choices)
    issues.deadEnds = allSceneIds.filter(id => {
      const scene = story.scenes[id];
      return scene.choices.length === 0;
    });
    
    // Find missing scenes (referenced but don't exist)
    const referencedScenes = new Set<string>();
    allSceneIds.forEach(id => {
      const scene = story.scenes[id];
      scene.choices.forEach(choice => {
        referencedScenes.add(choice.nextSceneId);
      });
    });
    
    issues.missingScenes = Array.from(referencedScenes)
      .filter(id => !allSceneIds.includes(id));
    
    // Find circular paths
    issues.circularPaths = paths
      .filter(path => {
        const sceneSet = new Set(path);
        return sceneSet.size < path.length && !path.includes('...') && !path.includes('INVALID_SCENE');
      })
      .map(path => path.join(' -> '));
    
    return issues;
  }
} 