import Gateway from './Gateway';
import { CrashReport } from 'api';

export default class CrashesApi {
  public static reportCrash(crashReport: CrashReport) {
    console.log('REPORTING CRASH', crashReport);
    return Gateway.post('/api/crashes', crashReport);
  }
}
