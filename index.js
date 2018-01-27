  $( document ).ready(function() {
    console.log( "document loaded" );

    Quiz.initApp();
});

const Quiz = {
  //Answer key including index # from potential answers
  quizAnswerKey: [
    1, // Varys
    2, // Tywin
    3, // Aemon
    0, // Brienne
    2, // Syrio
    1, // Bronn
    2, // Tyrion
    1, // Arya
    3, // Lyanna
    2  // Bronn
  ],
  nameAnswerKey: [
    'Varys',
    'Tywin Lannister',
    'Aemon Targaryen',
    'Brienne of Tarth',
    'Syrio Forel',
    'Bronn',
    'Tyrion Lannister',
    'Arya Stark',
    'Lyanna Mormont',
    'Bronn'
  ],
  answersCorrect: 0,
  answersIncorrect: 0,
  question: 0,
  initApp: function() {
    Quiz.startQuiz();
    Quiz.setup();
  },
  startQuiz: function() {
    $('.startBtn').on('click', function() {
      Quiz.showQuestion(0);
      Quiz.toggleStartPage();
      Quiz.toggleScorekeeper();
    });
  },
  setup: function() {
    Quiz.bindSubmitButtons();
    Quiz.bindContinueButtons();
    Quiz.restartApp();
    Quiz.bindListLinks();
  },
  toggleStartPage: function() {
    $('.startPage').toggle();
  },
  toggleScorekeeper: function() {
    $('.scoreKeeper').toggle();
  },
  toggleLastPage: function() {
    $('.lastPage').toggle();
    $('.scoreKeeper').hide();
  },
  // Uses array indexing for parameter
  showQuestion: function(questionNumber) {
    console.log('showing question number', (parseInt(questionNumber) + 1));
    let $questionContainer = $('.questionContainer');
    $questionContainer.eq(questionNumber).show();
  },
  bindSubmitButtons: function() {
    $('.submitBtn').on('click', function(event) {
      let $parentQuestionContainer = $(this).parent();
      let $answers = $parentQuestionContainer.find('input[type="radio"]');
      let answerSelected = false;
      $answers.each(function() {
        if($(this).prop('checked')) {
          answerSelected = true;
        }
      });
      // Validation step
      if(!answerSelected) {
        $('span.noAnswer').html('<p style="font-size: .98em;">You must select an answer before continuing</p>').show();
      }
      else {
        // an answer is selected - proceed
        // hide submit button, show 'Continue' button
        $(this).hide();
        $('span.noAnswer').empty();
        $('.feedback').show();
        $parentQuestionContainer.find('.continueBtn').show();
        Quiz.updateScore($answers);
      }
    });
  },
  bindContinueButtons: function() {
    $('.continueBtn').on('click', function(event) {
      console.log('continue button clicked');
      let $questionContainer = $(this).parent('.questionContainer');
      // hide parent question container
      $questionContainer.hide();
      // hide continue button
      $(this).hide();
      // hide question response and gif image
      $('.gif').hide();
      // hide feedback paragraph
      $('.feedback').empty();
      // show submit button for submitted question to handle restarting in same state
      $(this).parent().find('.submitBtn').show();
      let containerIndex = $questionContainer.index();
      let questionContainerLength = $('.questionContainer').length;
      let nextQuestion = containerIndex + 1;
      if(questionContainerLength !== nextQuestion){
        // find next question and pass it to showQuestion
        Quiz.showQuestion(nextQuestion);
        Quiz.question++;
      }
      else {
        // was final question, move to last page
        Quiz.toggleLastPage();
        Quiz.question = 0;
      }
    });
  },
  updateScore: function($answers) {
    let answerNumber = null;
    // Loop over answers and check which one is selected
    $answers.each(function(index) {
      if($(this).prop('checked')) {
        answerNumber = index;
        $(this).parents('ul').find('input[type="radio"]').eq(Quiz.quizAnswerKey[Quiz.question]).parent('li').addClass('correctAnswer');
      }
    });
    //compare answerNumber to answers array
    if (answerNumber === Quiz.quizAnswerKey[Quiz.question]) {
      Quiz.correctAnswer();
    } else {
      Quiz.incorrectAnswer();
    }
  },
  correctAnswer: function() {
    Quiz.answersCorrect++;
    Quiz.updateCorrectAnswer();
    $('.feedback').text('That is the correct answer!');
    $('.correctGif').fadeIn(250).delay(600).fadeOut(1850);
  },
  incorrectAnswer: function() {
    Quiz.answersIncorrect++;
    Quiz.updateIncorrectAnswer();
    $('.feedback').text(`You answered incorrectly. The correct answer is ${Quiz.nameAnswerKey[Quiz.question]}`);
    $('.incorrectGif').fadeIn(250).delay(600).fadeOut(1850);
  },
  updateCorrectAnswer: function() {
    $('.correct .current').html(Quiz.answersCorrect);
  },
  updateIncorrectAnswer: function() {
    $('.incorrect .current').html(Quiz.answersIncorrect);
  },
  restartApp: function() {
    $('.restartBtn').on('click', function(event) {
      // hide the last page
      $(this).parent('.lastPage').hide();
      Quiz.resetScore()
      Quiz.resetRadioButtons();
      Quiz.toggleScorekeeper();
      Quiz.showQuestion(0);
    });
  },
  clearCorrectHighlights: function() {
    $('li').removeClass('correctAnswer');
  },
  resetScore: function() {
    Quiz.answersCorrect = 0;
    Quiz.answersIncorrect = 0;
    Quiz.updateIncorrectAnswer();
    Quiz.updateCorrectAnswer();
    Quiz.clearCorrectHighlights();
  },
  resetRadioButtons: function() {
    $('input[type="radio"]').each(function() {
        $(this).prop('checked', false);
      });
  },
  // select radio button options with click of entire list item area instead of just button/label
  bindListLinks: function() {
    $('.answers li').on('click', function(event) {
      $(this).find('input[type="radio"]').prop('checked', true);
    });
  },
};







