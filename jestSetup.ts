import './jestGlobalMocks';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'jest-extended';
// https://github.com/thymikee/jest-preset-angular/issues/347
import '@angular/localize/init';

// Schematics register install tasks; unit tests never run their terminal spinner.
jest.mock('ora', () => jest.fn());

setupZoneTestEnv();
