export interface JunoState {
  dco: {
    pulse: boolean;
    saw: boolean;
    sub: number; // 0 till 1
    noise: number; // 0 till 1
    pwm: number;
    range: 16 | 8 | 4;
  };
  vcf: {
    cutoff: number;
    resonance: number;
    envMod: number;
    lfoMod: number;
    kybd: number;
  };
  adsr: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  chorus: 0 | 1 | 2;
  hpf: number;
}
