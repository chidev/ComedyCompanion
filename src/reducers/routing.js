import * as types from '../actions/actionTypes';

const initialState = {
  visible_panes: ['jokes', 'set_lists', 'shows'],
  title: 'Jokes'
};

export default function routing(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.title
      };
    case types.SET_VISIBLE_PANES:
      return {
        ...state,
        visible_panes: action.panes
      };
    case types.ADD_VISIBLE_PANE:
      let add_visible_panes = state.visible_panes;
      if (add_visible_panes.indexOf(action.pane) == -1) {
        add_visible_panes.push(action.pane);
      }

      return {
        ...state,
        visible_panes: add_visible_panes
      };
    case types.REMOVE_VISIBLE_PANE:
      let remove_visible_panes = state.visible_panes;
      let index = remove_visible_panes.indexOf(action.pane);
      if (index != -1) {
          remove_visible_panes.splice(index, 1);
      }

      return {
          ...state,
          visible_panes: remove_visible_panes
      };
    default:
      return state;
  }
}
