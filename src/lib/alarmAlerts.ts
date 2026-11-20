// Everything that gets your attention when an alarm goes off:
// sound, a system notification, and vibration on phones.

const RING_SECONDS = 60;
const SECONDS_BETWEEN_BURSTS = 1.6;
const BEEP_FREQUENCIES = [880, 1175, 880, 1175];
const SECONDS_BETWEEN_BEEPS = 0.22;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  audioContext = new AudioContextClass();
  return audioContext;
}

// Browsers only allow sound after you've touched the page. Calling this on
// the first click or key press makes sure the alarm can ring later on its own.
export function unlockAlarmAudio() {
  const context = getAudioContext();

  if (context && context.state === "suspended") {
    void context.resume();
  }
}

// Rings for a full minute: four beeps, a short pause, then again.
// Every beep is scheduled on the audio clock up front instead of using
// timers, so a background tab that slows its timers can't stretch or cut
// the ring. Returns a function that stops it straight away.
export function startAlarmSound(): () => void {
  const context = getAudioContext();

  if (!context) {
    return () => {};
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  const master = context.createGain();
  master.gain.value = 0.2;
  master.connect(context.destination);

  const oscillators: OscillatorNode[] = [];
  const startAt = context.currentTime + 0.05;

  for (
    let burst = 0;
    burst * SECONDS_BETWEEN_BURSTS < RING_SECONDS;
    burst++
  ) {
    BEEP_FREQUENCIES.forEach((frequency, index) => {
      const beepStart =
        startAt +
        burst * SECONDS_BETWEEN_BURSTS +
        index * SECONDS_BETWEEN_BEEPS;

      const oscillator = context.createOscillator();
      const envelope = context.createGain();

      oscillator.type = "square";
      oscillator.frequency.value = frequency;

      // A quick fade in and out stops each beep from clicking.
      envelope.gain.setValueAtTime(0, beepStart);
      envelope.gain.linearRampToValueAtTime(1, beepStart + 0.02);
      envelope.gain.setValueAtTime(1, beepStart + 0.14);
      envelope.gain.linearRampToValueAtTime(0, beepStart + 0.18);

      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(beepStart);
      oscillator.stop(beepStart + 0.2);

      oscillators.push(oscillator);
    });
  }

  return () => {
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(0, context.currentTime);

    oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // Already finished, nothing to stop.
      }
    });

    master.disconnect();
  };
}

export function vibrateDevice() {
  if ("vibrate" in navigator) {
    navigator.vibrate([400, 200, 400, 200, 400]);
  }
}

export function requestAlarmNotificationPermission() {
  if (
    typeof Notification !== "undefined" &&
    Notification.permission === "default"
  ) {
    void Notification.requestPermission();
  }
}

// A system notification still shows up when DevDesk is in a background tab
// or the browser is behind other windows.
export function showAlarmNotification(title: string, body: string) {
  if (
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  try {
    const notification = new Notification(title, {
      body,
      tag: "devdesk-alarm",
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // Some phone browsers only allow notifications through a service worker.
  }
}