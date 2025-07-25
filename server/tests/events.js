const userEvents = require('../tests/events.json');

const updateUserInfo = () => {
  let search = true;
  let i = 0;

  let newData = {};

  while (search && i < userEvents.length) {
    if (userEvents[i].type == "PushEvent") {

      newData.date = userEvents[i].created_at;
      newData.repo = userEvents[i].repo.name;
      newData.message = userEvents[i].payload.commits[0].message;

      Profile.findOneAndUpdate(
        { _id: context.user._id },
        {
          $set: {
            "lastCommit.date": userEvents[i].created_at,
            "lastCommit.repo": userEvents[i].repo.name,
            "lastCommit.message": userEvents[i].payload.commits[0].message
          }
        },
        { new: true }
      );

      search = false;
    }
    i++;
  }
  
  return newData;
}

const info = updateUserInfo();

console.log(info);