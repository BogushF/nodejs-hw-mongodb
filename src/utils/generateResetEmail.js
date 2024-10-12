import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATES_PATH } from '../constants/path.js';
import Handlebars from 'handlebars';

const temlate = fs
  .readFileSync(path.join(TEMPLATES_PATH, 'reset-email.html'))
  .toString();

export const generateResetEmail = ({ name, resetLink }) => {
  const handlebarsTemplate = Handlebars.compile(temlate);

  return handlebarsTemplate({ name, resetLink });
};
