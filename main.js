const express = require('express')
const app = express();
const cors = require('cors')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./model');
const QuestionList = require('./Questions')




//knowledge base 
const database = require('./knowledgeBase');

//tau-prolog 
const pl = require("tau-prolog");
const loader = require("tau-prolog/modules/lists.js");
// const { user } = require('./model');
loader(pl);

app.use(bodyParser.json()) 
app.use(express.static('public'));
app.use(cors()) ;

//port number 
const port = 5000;

//mogoose connection
mongoose.connect("mongodb+srv://Raghava:msccs2021@cluster0.sza8cms.mongodb.net/?retryWrites=true&w=majority").then(() => console.log('conncect success')).catch(error => console.error("error is :",error));



//app.post for storing response objects

var facts = `student(yes)`;


var singleUser = {
    uid:  1,
    email:'vijaykamesh33@gmail.com',
    selectedQuestions:[],
    date: Date.now(),
    totalScore: 0,
    facts:''
}

app.get('/questions', ( req, res ) => {
    res.json(QuestionList);
})

app.get('/find', async (req,res) => {
    try {
        const totalUsers = await users.find();
        const totalCount = totalUsers.length;
        res.json({success: true, 
            totalCount:totalCount})
    } catch {
        console.log('data fetching from database has failed')
        res.json({success: false, fail: true})
    }
   
    
   
})
app.post('/submit', async (req,res) => {
    singleUser.uid = req.body.users;
    
    let sum = 0;
    singleUser.selectedQuestions.map(question => {
        sum = sum + question.score;
    })
    singleUser.totalScore = sum;
    singleUser.facts = facts;
    
     
    singleUser.date =  new Date();

    console.log('on submit post', singleUser);
    const result = new users(singleUser);
    try{
        await result.save();
        console.log('successfully saved data');
        res.json({success: true, totalScore : singleUser.totalScore, questions: singleUser.selectedQuestions})

    } catch {
        console.log('save error occured');
        res.json({success: false, fail: true})
    }
    
    
       singleUser.selectedQuestions = []; 
    
})

app.post('/data', (req,res)=>{
    const response = {
        questionId: req.body.questionId,
        title: req.body.title,
        predicate: req.body.predicate,
        argument: req.body.argument,
        option: req.body.option,
        score: req.body.score
    };

  
    const { questionId, title, predicate, argument, option, score } = response;

    //storing user response in responseData array
    // responseData.push(response);
    singleUser.selectedQuestions.push(response);
    // console.log(singleUser)
   

    // concatinatin predicates as facts
    facts= facts + `,${predicate}(${argument}, ${option})`;

    // sum of total score based on  user selected option
    // totalScore = totalScore + score;
    // console.log('total score is: ', totalScore);
   
    // storing user selected question with option and score in selectedQuestions array
    // selectedQuestions.push({
    //     questionId,
    //     title,
    //     option,
    //     score
    // })

    // console.log(selectedQuestions);
    
    // const result = new users({id: 1, count: 0});
    // result.save()
    

})

// prolog logic implementation through get method '/'
app.get('/prolog', (req, res) => {
  


    var session = pl.create();
        
        //senseion.consult();
        session.consult(` ${database}student(depression):-${facts}.`, {
            

            //consult on success
            success: function() {
                console.log(` ${database}student(depression):-${facts}.`)
                console.log('session consult is success.');

                //query start
                session.query(`student(depression).`,{
                    //query on success
                    success: function(goal) {
                        console.log('query success:');
                        //first answer start
                        session.answer({
                            //first answer on success
                            success: function(ans) {
                                console.log('first answer on success')
                                show(ans);
                                            //second answer
                                            session.answer({
                                                //second answer on success
                                            success: function(ans) {
                                                        console.log('second answer on success')
                                                         show(ans);
                                                         //third answer 
                                                            session.answer({
                                                                //third answer on success
                                                              success: function(ans) {
                                                                 console.log('third answer on success',ans)
                                                    },
                                                    //third answer on fail
                                                    faill: function() {
                                                        console.log('third answer on fails')
                                                    }
                                                })
                                        },
                                        //second answer on fail
                                        fail: () => {
                                            console.log('second answer on fail')
                                        }
                                    })
                            },
                            //first answer fail
                            fail: function() {
                                console.log('first answer on fail')
                            }
                        })
                        
                        //answer end
                    },
                    //query error
                    error: function(error) {
                        console.log('query error', error)
                    },
                    //query fail
                    faill: function() {
                        console.log('query fail')
                    }
                });
                


                //queary end
            },

            //consult on error
            error: function(err) {
                console.log('failure')
            }
        }
        );

        
         //output start
        var show = function (answer) {
             console.log('X value is', session.format_answer(answer));
             
        };
        //output end

       

       
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})