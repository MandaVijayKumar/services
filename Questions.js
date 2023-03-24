const QuestionList = [
    {id:1, title:'Are you anger?', predicate:'student', argument:'anger',  options: [{a:'never', score:0}, {a:'sometimes',score: 1}, {a:'often', score:2}]},
    {id:2, title:'Do you feel Irritatable?', predicate:'student', argument:'irritatable', options: [{a:'never', score:0}, {a:'sometimes',score: 1}, {a:'often', score:2}]},
    {id:3, title:'Do you feel afraid of failure?', predicate:'student', argument:'afraidOfFail', options: [{a:'never', score:0}, {a:'sometimes',score: 1}, {a:'often', score:2}]},
    {id:4, tile:'submit', handler: 'submitHandler'}
   ];

   module.exports = QuestionList;