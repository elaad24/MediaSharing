export function isSuspiciousUrl(url: string): boolean {
  const suspiciousPatterns = [
    "malware",
    "exploit",
    "phishing",
    ".ru",
    ".exe",
    ".zip",
    ".rar",
  ];

  return suspiciousPatterns.some((pattern) => url.includes(pattern));
}

// Function to check if frame header values are valid
export function isValidFrameHeader(
  versionBits: number,
  layerBits: number,
  bitrateBits: number,
  sampleRateBits: number
): boolean {
  const validVersions = [0, 2, 3];
  const validLayers = [1, 2, 3];
  const validBitrates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const validSampleRates = [0, 1, 2, 3];

  return (
    validVersions.includes(versionBits) &&
    validLayers.includes(layerBits) &&
    validBitrates.includes(bitrateBits) &&
    validSampleRates.includes(sampleRateBits)
  );
}

// Function to get the bitrate based on version and layer
export function getBitrate(
  versionBits: number,
  layerBits: number,
  bitrateBits: number
): number {
  const bitrateTable: { [key: string]: number[] } = {
    "1-1": [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448], // Version 1, Layer 1
    "1-2": [32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384], // Version 1, Layer 2
    "1-3": [32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], // Version 1, Layer 3
    "2-1": [32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256], // Version 2, Layer 1
    "2-2": [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], // Version 2, Layer 2
    "2-3": [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], // Version 2, Layer 3
    "0-1": [32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256], // Version 2.5, Layer 1
    "0-2": [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], // Version 2.5, Layer 2
    "0-3": [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], // Version 2.5, Layer 3
  };

  const key = `${versionBits}-${layerBits}`;
  return bitrateTable[key] ? bitrateTable[key][bitrateBits - 1] * 1000 : 0;
}

// Function to get the sample rate based on version
export function getSampleRate(
  versionBits: number,
  sampleRateBits: number
): number {
  const sampleRateTable = [
    [44100, 48000, 32000], // Version 1
    [22050, 24000, 16000], // Version 2
    [11025, 12000, 8000], // Version 2.5
  ];

  if (versionBits === 3) {
    // Version 1
    return sampleRateTable[0][sampleRateBits];
  } else if (versionBits === 2) {
    // Version 2
    return sampleRateTable[1][sampleRateBits];
  } else if (versionBits === 0) {
    // Version 2.5
    return sampleRateTable[2][sampleRateBits];
  } else {
    return 0;
  }
}

// Function to calculate frame size
export function calculateFrameSize(
  bitrate: number,
  sampleRate: number,
  paddingBit: number
): number {
  return Math.floor((144 * bitrate) / sampleRate) + paddingBit;
}
