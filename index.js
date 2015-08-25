var xhr = new XMLHttpRequest();
xhr.open('GET', document.location + '/data.json');
xhr.onload = useData;
xhr.send();

function useData() {
  if (this.status === 200) {
    var data = JSON.parse(this.responseText);
    if ('load' in paella) {
      loadPaellaWithData(data);
    }
    else {
      loadLegacyPaellaWithData(data);
    }
  }
  else {
    throw new Error('Error while making request. XHR status: ' + this.status);
  }
}

function loadPaellaWithData(data) {
  paella.load(
    'playerContainer',
    {
      data: data
    }
  );
}

function loadLegacyPaellaWithData(data) {
  var HarnessVideoClass = createVideoLoader(data);

  var initDelegate = new paella.InitDelegate({
    accessControl: new (Class.create(paella.AccessControl, {
      checkAccess: sayOK
    })),
    videoLoader: new HarnessVideoClass(),    
  });

  initDelegate.getId = function id() {
    return 'non-null-something';
  };

  initPaellaEngage('playerContainer', initDelegate);
}

function createVideoLoader(data) {
  return Class.create(
    paella.VideoLoader,
    {
      loadVideo: loadVideo
    }
  );

  function loadVideo(videoId, onSuccess) {
    var stream = {
      sources: {
        rtmp: [
          {
            src: 'rtmp://cp398121.live.edgefcs.net/live/arbitrary-target_1_200@345252',
            type: 'video/x-flv',
            res: {
              w: 1024,
              h: 768
            }
          }
        ]
      }
    };

    this.streams.push(stream);
    this.loadStatus = true;
    setTimeout(onSuccess, 0);
  }
}

function sayOK(onSuccess) {
  setTimeout(passBackAccessObjects, 0);

  function passBackAccessObjects() {
    onSuccess(
      {
        canRead: true,
        canWrite: true,
        canContribute: true,
        loadError: false,
        isAnonymous: true
      },
      {
        login: 'anonymous',
        name: 'Anonymous',
        avatar: 'resources/images/default_avatar.png'
      }
    );
  }
}
