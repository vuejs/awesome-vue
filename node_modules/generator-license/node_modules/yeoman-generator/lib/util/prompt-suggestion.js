'use strict';
const assert = require('assert');
const _ = require('lodash');

/**
 * @module promptSuggestion
 * @description Utilities to allow remembering answers to Inquirer.js prompts
 */
const promptSuggestion = module.exports;

/**
 * Returns the default value for a checkbox
 *
 * @param  {Object} question Inquirer prompt item
 * @param  {*} defaultValue  The stored default value
 * @return {*}               Default value to set
 * @private
 */
const getCheckboxDefault = (question, defaultValue) => {
  // For simplicity we uncheck all boxes and use .default to set the active ones
  for (const choice of question.choices) {
    if (typeof choice === 'object') {
      choice.checked = false;
    }
  }

  return defaultValue;
};

/**
 * Returns the default value for a list
 *
 * @param  {Object} question    Inquirer prompt item
 * @param  {*} defaultValue     The stored default value
 * @return {*}                  Default value to set
 * @private
 */
const getListDefault = (question, defaultValue) => {
  const choiceValues = question.choices.map(choice => typeof choice === 'object' ? choice.value : choice);
  return choiceValues.indexOf(defaultValue);
};

/**
 * Return true if the answer should be store in
 * the global store, otherwise false
 *
 * @param  {Object}       question Inquirer prompt item
 * @param  {String|Array} answer   The inquirer answer
 * @param  {Boolean}      storeAll Should store default values
 * @return {Boolean}               Answer to be stored
 * @private
 */
const storeListAnswer = (question, answer, storeAll) => {
  const choiceValues = question.choices.map(choice => {
    if (Object.prototype.hasOwnProperty.call(choice, 'value')) {
      return choice.value;
    }

    return choice;
  });

  const choiceIndex = choiceValues.indexOf(answer);

  // Check if answer is not equal to default value
  if (storeAll || question.default !== choiceIndex) {
    return true;
  }

  return false;
};

/**
 * Return true if the answer should be store in
 * the global store, otherwise false
 *
 * @param  {Object}       question Inquirer prompt item
 * @param  {String|Array} answer   The inquirer answer
 * @param  {Boolean}      storeAll Should store default values
 * @return {Boolean}               Answer to be stored
 * @private
 */
const storeAnswer = (question, answer, storeAll) => {
  // Check if answer is not equal to default value or is undefined
  if (answer !== undefined && (storeAll || question.default !== answer)) {
    return true;
  }

  return false;
};

/**
 * Prefill the defaults with values from the global store
 *
 * @param  {Store}        store     `.yo-rc-global` global config
 * @param  {Array|Object} questions Original prompt questions
 * @return {Array}                  Prompt questions array with prefilled values.
 */
promptSuggestion.prefillQuestions = (store, questions) => {
  assert(store, 'A store parameter is required');
  assert(questions, 'A questions parameter is required');

  const promptValues = store.get('promptValues') || {};

  if (!Array.isArray(questions)) {
    questions = [questions];
  }

  questions = questions.map(_.clone);

  // Write user defaults back to prompt
  return questions.map(question => {
    if (question.store !== true) {
      return question;
    }

    const storedValue = promptValues[question.name];

    if ((storedValue === undefined) || _.isFunction(question.choices)) {
      // Do not override prompt default when question.choices is a function,
      // since can't guarantee that the `storedValue` will even be in the returned choices
      return question;
    }

    // Override prompt default with the user's default
    switch (question.type) {
      case 'rawlist':
      case 'expand':
        question.default = getListDefault(question, storedValue);
        break;
      case 'checkbox':
        question.default = getCheckboxDefault(question, storedValue);
        break;
      default:
        question.default = storedValue;
        break;
    }

    return question;
  });
};

/**
 * Store the answers in the global store
 *
 * @param  {Store}        store     `.yo-rc-global` global config
 * @param  {Array|Object} questions Original prompt questions
 * @param  {Object}       answers   The inquirer answers
 * @param  {Boolean}      storeAll  Should store default values
 */
promptSuggestion.storeAnswers = (store, questions, answers, storeAll) => {
  assert(store, 'A store parameter is required');
  assert(answers, 'A answers parameter is required');
  assert(questions, 'A questions parameter is required');
  assert.ok(_.isObject(answers), 'answers must be a object');

  storeAll = storeAll || false;
  const promptValues = store.get('promptValues') || {};

  if (!Array.isArray(questions)) {
    questions = [questions];
  }

  _.each(questions, question => {
    if (question.store !== true) {
      return;
    }

    let saveAnswer;
    const key = question.name;
    const answer = answers[key];

    switch (question.type) {
      case 'rawlist':
      case 'expand':
        saveAnswer = storeListAnswer(question, answer, storeAll);
        break;

      default:
        saveAnswer = storeAnswer(question, answer, storeAll);
        break;
    }

    if (saveAnswer) {
      promptValues[key] = answer;
    }
  });

  if (Object.keys(promptValues).length > 0) {
    store.set('promptValues', promptValues);
  }
};
