const userEvents = require('../tests/events.json');
console.log(userEvents);

const updateUserInfo = () => {
  let search = true;
  let i = 0;

  let newData = {};
// TO DO: Change commit info into a single array in the profile schema and fetch and store all recent commit info in the array
  while (search && i < userEvents.length) {
    if (userEvents[i].type == "PushEvent") {
      date = userEvents[i].created_at;
      repo = userEvents[i].repo.name;
      message = userEvents[i].payload.commits[0].message;
      search = false;
      newData.lastCommitDate = date;
      newData.lastcommitRepo = repo;
      newData.lastCommitMessage = message;
      // Profile.findOneAndUpdate(
      //   { _id: context.user._id },
      //   { lastCommitDate: date },
      //   { lastCommitRepo: repo },
      //   { lastCommitMessage: message },
      //   { new: true }
      // );
    }
    i++;
  }
  
  return newData;
}

const info = updateUserInfo();

console.log(info);