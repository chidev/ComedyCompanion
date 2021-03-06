'use strict';

import React, {Component} from 'react';
import { View, Text, ListView, ScrollView, TouchableHighlight } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import SortableListView from 'react-native-sortable-listview';

import * as setListActions from '../../../actions/setListActions';
import * as routingActions from '../../../actions/routingActions';

import jokeListStyles from '../../../stylesheets/jokeListStyles';
import setListListStyles from '../../../stylesheets/setListListStyles';

class JokeSelector extends Component {
  constructor(props) {
    super(props);

    this.listViewHeight = 0;
    this.rowHeights = {};
  }

  totalRowHeights() {
    let sum = 0;

    for (var key in this.rowHeights) {
      sum += this.rowHeights[key];
    }

    return sum;
  }

  componentDidUpdate(prevProps) {
    if (this.props.setListState.set_list._jokes.length > prevProps.setListState.set_list._jokes.length) {
      this.jokeAdded = true;
    }
  }

  measureView(event) {
    this.listViewHeight = event.nativeEvent.layout.height;
  }

  measureRow(joke_id, event) {
    this.rowHeights[joke_id] = event.nativeEvent.layout.height;

    if (Object.keys(this.rowHeights).length == this.props.setListState.set_list._jokes.length) {
      if ((this.jokeAdded) && (this.totalRowHeights() >= this.listViewHeight)) {
        this.listView.scrollResponder.scrollToEnd();
        this.jokeAdded = false;
      }
    }
  }

  render() {
    const { setListState, setListActions } = this.props;

    const selectJoke = (joke) => {
      delete this.rowHeights[joke._id];
      setListActions.removeJokeFromSL(joke);
    };

    let data = {};
    setListState.set_list._jokes.forEach((joke, i) => {
      data['joke_' + joke._id] = joke;
    });

    let order = Object.keys(data);

    const renderRow = (rowData, sectionID, rowID, highlightRow) => {
      return (
        <TouchableHighlight
          onLayout={ this.measureRow.bind(this, rowData._id) }
          underlayColor={'#ccc'}
          delayLongPress={500}
          onPress={ () => selectJoke(rowData) }
          style={ [setListListStyles.setListJokeRow, {borderBottomWidth: 1, borderBottomColor: '#CCCCCC'}] }
          {...this.props.sortHandlers}>
          <View style={ {alignItems: 'center'} }>
            <Text style={ [jokeListStyles.jokeName, { textAlign: 'center' }] }>{ rowData._name }</Text>
          </View>
        </TouchableHighlight>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#EEEEFF', height: 50, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#CCCCCC' }}>
          <Text style={{ color: '#000000' }}>Set List</Text>
          <Text style={ setListListStyles.jokeInstructions }>tap to remove</Text>
          <Text style={ setListListStyles.jokeInstructions }>hold to reorder</Text>
        </View>
        <View onLayout={ this.measureView.bind(this) } style={{ flex: 1 }}>
          <SortableListView
            style={{flex: 1}}
            ref={(listView) => this.listView = listView}
            data={data}
            order={order}
            onRowMoved={e => {
              setListState.set_list._jokes.splice(e.to, 0, setListState.set_list._jokes.splice(e.from, 1)[0]);
              setListActions.setSL(setListState.set_list);
            }}
            renderRow={renderRow}
          />
       </View>
      </View>
    );
  }
}

export default connect(state => ({
    setListState: state.set_list
  }),
  (dispatch) => ({
    setListActions: bindActionCreators(setListActions, dispatch),
    routingActions: bindActionCreators(routingActions, dispatch)
  })
)(JokeSelector);
