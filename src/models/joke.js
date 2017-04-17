import { AsyncStorage } from 'react-native';

import Model from './Model';

export default class Joke extends Model {
  static tableName() {
    return "jokes";
  }

  constructor(data = { _id: -1, _in_development: false, _name: '', _notes: '' })
  {
    super();

    this._id             = data._id;
    this._in_development = data._in_development;
    this._name           = data._name;
    this._notes          = data._notes;
  }
}
