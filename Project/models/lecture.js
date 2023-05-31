const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  번호:{ 
   type:Number
  },
  전공:{ 
    type:String
   },
  교과목명:{ 
    type:String
   },
  교원명:{ 
    type:String
   },
  요일:{ 
    type:String
   },
  시간:{ 
    type:String
   },
  강의실:{ 
    type:String
   },
  학수강좌번호:{ 
    type:String
   },
  학점:{ 
    type:Number
   }
});

lectureSchema.statics.findLectures = function(major, keyword) {
  const query = {
    $and: [
      { 전공: { $regex: new RegExp(major, 'i') } },
      { 교과목명: { $regex: new RegExp(keyword, 'i') } }
    ]
  };
  return this.find(query);};

const Lecture = mongoose.model('lecture', lectureSchema, 'lecture');
module.exports = Lecture;