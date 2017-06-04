'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import { View, Text, TouchableHighlight, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import ExpandingView from '../components/ExpandingView';

import * as routingActions from '../actions/routingActions';
import * as statusBarActions from '../actions/statusBarActions';

import statusBarStyles from '../stylesheets/statusBarStyles';
import layoutStyles from '../stylesheets/layoutStyles';

import {jokesIcon, setListsIcon, showsIcon, settingsIcon, aboutIcon, menuIcon, closeIcon} from '../helpers/icons';

class StatusBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { statusBarState, routingState, statusBarActions, routingActions } = this.props;

    const clickHamburger = () => {
      Keyboard.dismiss();

      statusBarActions.toggleHamburgerActive();

      statusBarState.hamburger_active ? this.navBarView.performShrink() : this.navBarView.performExpand();
    };

    const clickNavLink = (pane) => {
      Keyboard.dismiss();

      routingActions.setPane(pane);
      this.props.setActivePane(pane);
      statusBarActions.toggleHamburgerActive();

      this.navBarView.performShrink();
    };

    const clickSettings = () => {
      routingActions.toggleSettings();
    };

    const clickAbout = () => {
      routingActions.toggleAbout();
    };

    const renderSettingsButton = () => {
      return (
        <View style={ statusBarStyles.gearIcon }>
          <TouchableHighlight underlayColor="#EEEEEE"
                              style={{ flex: 1, alignItems: 'center', paddingTop: 7, paddingLeft: 7 }}
                              onPress={ clickSettings }>
            <Text style={{width: '100%'}}>{ settingsIcon }</Text>
          </TouchableHighlight>
        </View>
      );
    };

    const renderAboutButton = () => {
      return (
        <View style={ statusBarStyles.aboutIcon }>
          <TouchableHighlight underlayColor="#EEEEEE"
                              style={{ flex: 1, alignItems: 'center', paddingTop: 7, paddingLeft: 7 }}
                              onPress={ clickAbout }>
            <Text style={{width: '100%'}}>{ aboutIcon }</Text>
          </TouchableHighlight>
        </View>
      );
    };

    const renderNavBarButton = (pane, icon, text, styles) => {
      return  <TouchableHighlight underlayColor="#EEEEEE"
                                  style={ [statusBarStyles.navLink, styles] }
                                  onPress={() => clickNavLink(pane)}>
        <View style={ { flexDirection: 'row' } }>
          { icon }
          <Text style={statusBarStyles.navLinkText}>{text}</Text>
        </View>
      </TouchableHighlight>
    };

    const renderNavBar = () => {
      return  <ExpandingView ref={(navBarView) => this.navBarView = navBarView}
                             style={ [statusBarStyles.navBar] }
                             expandedHeight={40}>
        { renderNavBarButton('jokes', jokesIcon, 'Jokes', { borderRightColor: '#CCCCCC', borderRightWidth: 1 }) }
        { renderNavBarButton('set_lists', setListsIcon, 'Set Lists', { borderRightColor: '#CCCCCC', borderRightWidth: 1 }) }
        { renderNavBarButton('shows', showsIcon, 'Shows') }
      </ExpandingView>
    };

    return (
      <View>
        <View style={layoutStyles.statusBarBuffer} />
        <View style={layoutStyles.statusBar}>
          <View style={ statusBarStyles.hamburger }>
            <TouchableHighlight underlayColor="#EEEEEE" style={{ width: 40, alignItems: 'center', paddingTop: 2, paddingLeft: 5 }}
                                onPress={ clickHamburger }>
              <Text style={{width: '100%'}}>{ statusBarState.hamburger_active ? closeIcon : menuIcon }</Text>
            </TouchableHighlight>
          </View>
          <View style={ { flexDirection: 'row' } }>
            <Text style={statusBarStyles.title}>{routingState.title}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            { renderAboutButton() }
            { renderSettingsButton() }
          </View>
        </View>
        { renderNavBar() }
      </View>
    );
  }
}

export default connect(state => ({
    statusBarState: state.statusBar,
    routingState: state.routing
  }),
  (dispatch) => ({
    statusBarActions: bindActionCreators(statusBarActions, dispatch),
    routingActions: bindActionCreators(routingActions, dispatch)
  })
)(StatusBar);