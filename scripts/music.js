let scrobbleIsDragging = false;

function onload() {
    api.media.observeData(function (newData) {
        // Hide the entire player if not playing
        document.getElementById('divMusic').style.display = (newData.isStopped ? 'none' : 'grid');
        
        document.getElementById('track').innerHTML = (newData.nowPlaying.title.length > 0 ? newData.nowPlaying.title : 'Unknown Title');
        document.getElementById('artist').innerHTML = (newData.nowPlaying.artist.length > 0 ? newData.nowPlaying.artist : 'Unknown Artist');
        document.getElementById('artwork').src = newData.nowPlaying.artwork.length > 0 ? newData.nowPlaying.artwork : 'xui://resource/default/media/no-artwork.svg';
        document.getElementById('artwork').className = newData.nowPlaying.artwork.length > 0 ? 'content' : '';
        document.getElementById('play').style.display = (newData.isPlaying ? 'none' : 'initial');
        document.getElementById('pause').style.display = (newData.isPlaying ? 'initial' : 'none');
        handleTrackTimes(newData.nowPlaying.elapsed, newData.nowPlaying.length, false);
        handleScrobblePosition(newData.nowPlaying.elapsed, newData.nowPlaying.length);
    });

    api.media.observeElapsedTime(function (newElapsedTime) {
        handleTrackTimes(newElapsedTime, api.media.nowPlaying.length, false);
        handleScrobblePosition(newElapsedTime, api.media.nowPlaying.length);
    });
}

function handleTrackTimes(elapsed, length, forceUpdate) {
    if (scrobbleIsDragging && !forceUpdate) {
        return;
    }

    const elapsedContent = length === 0 ? '--:--' : secondsToFormatted(elapsed);
    document.getElementById('elapsed').innerHTML = elapsedContent;
    const lengthContent = length === 0 ? '--:--' : secondsToFormatted(length);
    document.getElementById('length').innerHTML = lengthContent;
    document.getElementById('playback-time').setAttribute('max', length);
    document.getElementById('playback-time').value = elapsed;
}

function handleScrobblePosition(elapsed, length) {
    if (scrobbleIsDragging) {
        return;
    }

    const scrobble = document.getElementById('scrobble-slider');
    scrobble.setAttribute('max', length);
    scrobble.value = elapsed;
}

function secondsToFormatted(seconds) {
    if (seconds === 0) {
        return '0:00';
    }

    const isNegative = seconds < 0;
    if (isNegative) {
        return '0:00';
    }

    seconds = Math.abs(seconds);
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor(seconds / 60) - (hours * 60);
    const secs = Math.floor(seconds - (minutes * 60) - (hours * 60 * 60));

    if (hours > 0) {
        return hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs;
    } else {
        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }
}

function onScrobbleUIChanged(input) {
    scrobbleIsDragging = true;
    handleTrackTimes(input, api.media.nowPlaying.length, true);
}

function onScrobbleChanged(input) {
    api.media.seekToPosition(input);
    handleTrackTimes(input, api.media.nowPlaying.length, true);
    scrobbleIsDragging = false;
}