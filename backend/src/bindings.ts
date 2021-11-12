import { Container } from 'inversify';
import 'reflect-metadata';
import { BillService } from './logic/BillService';
import { GoogleApi } from './logic/GoogleApi';

const container: Container = new Container();

container.bind<BillService>(BillService).toSelf();
container.bind<GoogleApi>(GoogleApi).toSelf().inSingletonScope();

export { container as bindings };
