'use strict';

import React, {Component} from 'react';
import { View, Text } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {Button} from 'react-native-ui-xg';

import * as routingActions from '../../actions/routingActions';

import layoutStyles from '../../stylesheets/layoutStyles';

import {largeShowsIcon, addShowIcon} from '../../helpers/icons';

class Shows extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { routingActions } = this.props;

    return (
      <View style={layoutStyles.centeredFlex}>
        {largeShowsIcon}
        <Text style={ {paddingTop: 25} }>You do not appear to have any shows yet!</Text>
        <Text style={ {paddingBottom: 20} }>Click the button below to add one..</Text>
        <View style={ {paddingBottom: 100} }>
          <Button type="surface" size="large" theme="red" onPress={ routingActions.openModal }>
            <Text>{addShowIcon}</Text>
            <Text style={layoutStyles.buttonText}>Add Show</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default connect(state => ({

  }),
  (dispatch) => ({
    routingActions: bindActionCreators(routingActions, dispatch)
  })
)(Shows);
