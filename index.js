
$(document).ready(function() {
  main("all");
  $(".streamSelector").click(function() {
    changeDisplay($("input[name=streamSelector]:checked").val())
  });
  $("#streamAddButton").click(function() {
    toggleAddButton();
  });
  $("#streamAddInput").hide();
  $("#streamAddInput").keypress(function(key) {
    if(key.which === 13){
      getChannelsInfo($("#streamAddInput").val(), "all");
      return false;
    }
  });
});

function main(onlineStatus) {
  removeResultDivs();
  let channels = getFollowedChannels();
  for (let channel in channels) {
    getChannelsInfo(channels[channel], onlineStatus);
  }
}

function changeDisplay(type) {
  console.log(type);
  if (type === "all") {
    $(".streamOnline").show();
    $(".streamOffline").show();
  } else if (type === "online") {
    $(".streamOnline").show();
    $(".streamOffline").hide();
  } else {
    $(".streamOnline").hide();
    $(".streamOffline").show();
  }
}

function getFollowedChannels() {
  //in lieu of a persistant database
  //assume all channels listed were checked to exist before returning here
  return ["sjow","hsdogdog","summit1g","shroud","notarealstreamer"];
}

function getChannelsInfo(streamerName, onlineStatus) {
  $.ajax( {
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/channels/'+streamerName,
    headers: {
      'Client-ID': '4rpyhy1l3823443zvc5pfojwnfkzwe'
    },
    success: function(result) {
      getStreamsInfo(result, streamerName, onlineStatus);
    },
    fail: function(e) {
      console.log("Failed to fetch Stream Data");
    },
    cache: false
  });
}

function getStreamsInfo(channelObj, streamerName, onlineStatus) {
  $.ajax( {
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/streams/'+streamerName,
    headers: {
      'Client-ID': '4rpyhy1l3823443zvc5pfojwnfkzwe'
    },
    success: function(result) {
      displayChannelInfo(result, channelObj, onlineStatus);
    },
    fail: function(e) {
      console.log("Failed to fetch Stream Data");
    },
    cache: false
  });
}

function displayChannelInfo(streamsData, channelData, onlineStatus) {
  console.log(streamsData);
  console.log(channelData);
  let streamLink 
  streamLink = buildStreamLink(streamsData, channelData).hide().fadeIn("fast");
  $("#resultSection").prepend(streamLink);
}

function buildStreamLink(streamsData, channelData) {
  
  let streamLink = $("<a>", {"class":"streamLink"});
  streamLink.addClass(streamsData.stream !== null ? "streamOnline" : "streamOffline");
  streamLink.attr("href", channelData.url);
  streamLink.attr("target", "_blank");

  let linkLeft = $("<div>", {"class":"linkLeft"});
  linkLeft.append("<img src="+ channelData.logo +" class='streamerLogo'>")
  streamLink.append(linkLeft);

  let linkRight = $("<div>", {"class":"linkRight"});
  linkRight.append("<h2 class='channelTitle'>"+channelData.display_name+"</h2>");
  let gameDisplay = $("<div>", {"class":"gameDisplay"});
  if (streamsData.stream !== null) {
    gameDisplay.append("<p class='channelGame'>"+streamsData.stream.game+"</p>")
    gameDisplay.append("<p class='onlineStatus'><span class='circle online'></span>"+streamsData.stream.viewers+"</p>")
  } else {
    gameDisplay.append("<p class='channelGame'>"+""+"</p>")
    gameDisplay.append("<p class='onlineStatus'><span class='circle offline'></span>"+"Offline"+"</p>")
  }
  linkRight.append(gameDisplay);
  streamLink.append(linkRight);
  
  return streamLink;
}

function removeResultDivs() {
  $("a.streamLink").remove();
}

function toggleAddButton() {
  if ($("#streamAddButton").html() === "+") {
    $("#streamAddButton").html("-");
    $("#streamAddInput").show();
  } else {
    $("#streamAddButton").html("+");
    $("#streamAddInput").hide();
  }
}