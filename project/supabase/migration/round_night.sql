/*
  # Add LeetCode Questions

  1. New Data
    - Add sample LeetCode questions with test cases
    - Add function templates for different languages
*/

-- Add sample LeetCode questions
INSERT INTO challenges (
  title,
  description,
  difficulty,
  points,
  category,
  sample_input,
  sample_output,
  time_limit,
  memory_limit,
  created_by
)
VALUES
(
  'Two Sum',
  E'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n' ||
  'You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n' ||
  'You can return the answer in any order.\n\n' ||
  'Example 1:\n' ||
  'Input: nums = [2,7,11,15], target = 9\n' ||
  'Output: [0,1]\n' ||
  'Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\n' ||
  'Example 2:\n' ||
  'Input: nums = [3,2,4], target = 6\n' ||
  'Output: [1,2]\n\n' ||
  'Constraints:\n' ||
  '- 2 <= nums.length <= 104\n' ||
  '- -109 <= nums[i] <= 109\n' ||
  '- -109 <= target <= 109\n' ||
  '- Only one valid answer exists',
  'easy',
  100,
  'arrays',
  '[2,7,11,15]\n9',
  '[0,1]',
  1000,
  128,
  (SELECT id FROM users WHERE username = 'admin')
),
(
  'Valid Parentheses',
  E'Given a string s containing just the characters ''()'', ''{}'', and ''[]'', determine if the input string is valid.\n\n' ||
  'An input string is valid if:\n' ||
  '1. Open brackets must be closed by the same type of brackets.\n' ||
  '2. Open brackets must be closed in the correct order.\n' ||
  '3. Every close bracket has a corresponding open bracket of the same type.\n\n' ||
  'Example 1:\n' ||
  'Input: s = "()"\n' ||
  'Output: true\n\n' ||
  'Example 2:\n' ||
  'Input: s = "()[]{}"\n' ||
  'Output: true\n\n' ||
  'Example 3:\n' ||
  'Input: s = "(]"\n' ||
  'Output: false',
  'easy',
  100,
  'strings',
  '()',
  'true',
  1000,
  128,
  (SELECT id FROM users WHERE username = 'admin')
);

-- Add test cases for Two Sum
INSERT INTO test_cases (challenge_id, input, expected_output, is_hidden)
VALUES
(
  (SELECT id FROM challenges WHERE title = 'Two Sum' LIMIT 1),
  '[2,7,11,15]\n9',
  '[0,1]',
  false
),
(
  (SELECT id FROM challenges WHERE title = 'Two Sum' LIMIT 1),
  '[3,2,4]\n6',
  '[1,2]',
  false
),
(
  (SELECT id FROM challenges WHERE title = 'Two Sum' LIMIT 1),
  '[3,3]\n6',
  '[0,1]',
  true
);

-- Add test cases for Valid Parentheses
INSERT INTO test_cases (challenge_id, input, expected_output, is_hidden)
VALUES
(
  (SELECT id FROM challenges WHERE title = 'Valid Parentheses' LIMIT 1),
  '()',
  'true',
  false
),
(
  (SELECT id FROM challenges WHERE title = 'Valid Parentheses' LIMIT 1),
  '()[]{}',
  'true',
  false
),
(
  (SELECT id FROM challenges WHERE title = 'Valid Parentheses' LIMIT 1),
  '(]',
  'false',
  false
),
(
  (SELECT id FROM challenges WHERE title = 'Valid Parentheses' LIMIT 1),
  '([)]',
  'false',
  true
);

-- Add starter code templates
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS starter_code_templates JSONB DEFAULT '{}'::jsonb;

UPDATE challenges 
SET starter_code_templates = jsonb_build_object(
  'javascript', 
  E'/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    \n}',
  'python',
  E'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ',
  'java',
  E'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}'
)
WHERE title = 'Two Sum';

UPDATE challenges 
SET starter_code_templates = jsonb_build_object(
  'javascript', 
  E'/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    \n}',
  'python',
  E'class Solution:\n    def isValid(self, s: str) -> bool:\n        ',
  'java',
  E'class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}'
)
WHERE title = 'Valid Parentheses';