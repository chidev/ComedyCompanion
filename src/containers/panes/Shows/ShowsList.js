'use strict';

import React, {Component} from 'react';
import { View, Text, ListView, ScrollView, TouchableHighlight, Platform, Keyboard, Switch, Modal } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Button} from 'react-native-ui-xg';
import SearchBar from 'react-native-material-design-searchbar';
import moment from 'moment';

import Show from '../../../models/show';

import ShowListHelper from '../../../helpers/showListHelper';

import * as showActions from '../../../actions/showActions';
import * as showListActions from '../../../actions/showListActions';
import * as routingActions from '../../../actions/routingActions';

import layoutStyles from '../../../stylesheets/layoutStyles';
import showListStyles from '../../../stylesheets/showListStyles';

import {addIcon} from '../../../helpers/icons';

class ShowsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view_height: 0,
      keyboard_height: 0,
      set_list_visible: false
    }
  }

  componentWillMount () {
    var eventVerb = Platform.OS === 'ios'? 'Will' : 'Did';

    this.keyboardDidShowListener = Keyboard.addListener('keyboard' + eventVerb + 'Show', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboard' + eventVerb + 'Hide', this.keyboardDidHide.bind(this));
  }

  keyboardDidShow (e) {
    this.setState({
      keyboard_height: e.endCoordinates.height
    });
  }

  keyboardDidHide (e) {
    this.setState({
      keyboard_height: 0
    });
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  measureView(event) {
    this.setState({
      view_height: event.nativeEvent.layout.height
    });
  }

  contentHeight() {
    return this.state.view_height - (Platform.OS === 'ios'? this.state.keyboard_height : 0);
  }

  render() {
    const { showListState, showState, showActions, routingActions, showListActions } = this.props;

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const showListDS = ds.cloneWithRows(showListState.show_list.map((show) => { return show._venue }));

    const addShow = () => {
      showActions.setShow(new Show());
      routingActions.openModal();
    };

    const editShow = (id) => {
      Show.get(id).then((show) => {
        showActions.setShow(show);
        routingActions.openModal();
      });
    };

    const viewSetList = (show) => {
      showActions.setShow(show);
      this.setState({
        set_list_visible: true
      });
    };

    const hideSetList = () => {
      this.setState({
        set_list_visible: false
      });
    };

    const renderRow = (rowData, sectionID, rowID, highlightRow) => {
      let show = showListState.show_list[rowID];

      return (
        <TouchableHighlight onPress={ () => editShow(show._id) }>
          <View style={ showListStyles.showRow }>
            <View style={{ flex: 1 }}>
              <Text style={ showListStyles.showName }>{ show._venue }</Text>
              <Text style={ showListStyles.updatedText }>{ moment(show._date).utc().format("MMM DD, YYYY") } in { show._city }, { show._state }</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={ showListStyles.showInfoView }>
                <TouchableHighlight onPress={ () => viewSetList(show) } style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ flex: 1, alignItems: 'flex-end', backgroundColor: '#EEFFEE', padding: 10, borderColor: '#EEEEEE', borderWidth: 1 }}>
                    <Text style={{ textAlign: 'center', fontSize: 10 }}>View Set List</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    };

    const renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: 1,
            backgroundColor: '#CCCCCC',
          }}
        />
      );
    };

    const renderAddButton = () => {
      return (
        <View style={ layoutStyles.addButtonView }>
          <TouchableHighlight style={ layoutStyles.addButton }
                              onPress={ addShow }>
            <Text style={{width: '100%'}}>{ addIcon }</Text>
          </TouchableHighlight>
        </View>
      );
    };

    const venueFilterChanged = (venue_filter) => {
      if (venue_filter.nativeEvent) {
        venue_filter = venue_filter.nativeEvent.text;
      }
      showListActions.setShowListFilter(venue_filter);

      ShowListHelper.refreshShowList({ venue_filter: venue_filter })
    };

    return (
      <View style={{ flex: 1 }}  onLayout={(event) => this.measureView(event)}>
        <View style={{ height: this.contentHeight(), justifyContent: 'flex-start' }}>
          <View style={{ backgroundColor: '#FFFFFF', width: '100%' }}>
            <SearchBar
              ref={(searchBar) => { this.searchBar = searchBar }}
              onSearchChange={ venueFilterChanged }
              height={30}
              onFocus={() => console.log('On Focus')}
              onBlur={() => console.log('On Blur')}
              placeholder={'Search...'}
              autoCorrect={false}
              padding={0}
              returnKeyType={'done'}
            />
          </View>
          <ListView
            dataSource={ showListDS }
            renderRow={ renderRow }
            renderSeparator={ renderSeparator }
            enableEmptySections={ true }
            style={{ backgroundColor: '#FFFFFF', flex: 1 }}
          />
          <View style={ layoutStyles.toolbar }>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>???</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              { renderAddButton() }
            </View>
          </View>
        </View>
        <Modal style={ layoutStyles.modal }
               animationType={"fade"}
               transparent={false}
               visible={this.state.set_list_visible}
               onRequestClose={() => { }}>
          <View style={layoutStyles.statusBarBuffer} />
          <View style={ { width: '100%', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#CCCCCC', paddingBottom: 10, paddingTop: 10, alignItems: 'center' } }>
            <Text style={ { fontWeight: 'bold', fontSize: 14 } }>Set List for { showState.show._venue }</Text>
          </View>
          <View style={ { flex: 1 } }>
            <ScrollView>
              { showState.show._set_list._jokes.map((joke) => {
                return <View key={ joke._id } style={ { flex: 1, backgroundColor: '#EEEEFF', borderBottomColor: '#CCCCCC', borderBottomWidth: 2 } }>
                         <TouchableHighlight onPress={ () => console.log("Joke Clicked") }>
                           <Text style={{ color: '#000000', padding: 10, textAlign: 'center' }}>{joke._name}</Text>
                         </TouchableHighlight>
                       </View>
              })
              }
            </ScrollView>
          </View>
          <View style={ { height: 40 } }>
            <Button type="surface" size="large" theme="gray" onPress={ hideSetList }>
              <Text style={layoutStyles.buttonText}>Close</Text>
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(state => ({
    showState: state.show,
    showListState: state.show_list
  }),
  (dispatch) => ({
    showActions: bindActionCreators(showActions, dispatch),
    showListActions: bindActionCreators(showListActions, dispatch),
    routingActions: bindActionCreators(routingActions, dispatch)
  })
)(ShowsList);
