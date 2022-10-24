import {App} from "./App";
import sourceMapSupport from 'source-map-support'

sourceMapSupport.install();
const app = new App();
app.bootstrap();
app.start();