import { Feature } from 'geojson';

export interface Flurstueck extends Feature {
  properties: {
    fsk: string,
    gemarkung: string,
    bezirk: string,
    flaeche: number,
    bplan_name: string,
    bplan_na: string,
    bplan_verf: string,
    vermoegen: string,
    pot_bewohn: number,
    restflae: number,
    merkmal: string,
    proz_bahn: number,
    proz_hag: number,
    proz_flbi: number,
    att_flbi: string,
    para_flbi: string,
    proz_klga: number,
    proz_wald: number,
    proz_nats: number,
    att_nats: string,
    proz_natd: number,
    att_natd: string,
    proz_fh: number,
    proz_gms: number,
    proz_lsz1: number,
    proz_strl: number,
    proz_bal: number,
    proz_indu: number,
    att_indu: string,
    proz_gew1: number,
    proz_gew2: number,
    proz_strw: number,
    proz_bebau: number,
    proz_woba: number,
    gebun_stat: string,
    gebun_beme: string,
    hart_proz: number,
    proz_ausgl: number,
    proz_uebg: number,
    proz_lans: number,
    att_lans: string,
    proz_bplw: number,
    att_biot: string,
    para_biot: string,
    proz_fl: number,
    proz_sfe: number,
    proz_park: number,
    att_park: string,
    bez_park: string,
    proz_stfl: number,
    weich_proz: number,
    zusatz: string
  };
}
