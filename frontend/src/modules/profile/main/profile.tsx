import * as React from 'react';
import './profile.scss';
import logo from '../../../assets/svg/logo.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export class ProfileComponent extends React.Component {

    // Define the props in component
    public props: any;

    public render() {
        return (
            <div className="profile">
                <div className="logo"><img src={logo}></img></div>
                <div className="quote">En construcción...</div>
            </div>
        )
    }
}

// Configure React-redux store functions
function mapStateToProps(state: any) {
    return {
      user: state.user.data
    }
  }
  
  function matchDispatchToProps(dispatch: any) {
    return bindActionCreators({
    }, dispatch);
  }
  
export default connect(mapStateToProps, matchDispatchToProps)(withRouter(ProfileComponent));