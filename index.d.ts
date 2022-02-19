import FileAsset from './src/helpers/file-manager/FileAsset';

declare global{
    export function playLocalSound(soundName: 'voice_visit_time_ended' | 'dial_tone'): Promise<{ stop: ()=>void, setOnEndListener: (cb: ()=>void)=>void }>
}
declare module 'api'{
    interface Chat{
        localFile?: FileAsset
    }
}
