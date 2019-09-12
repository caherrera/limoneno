import React from "react";
import './user-sidebar.scss';
import 'antd/dist/antd.css';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon, Form, Input, Button, Checkbox } from "antd";
import { setUser, setTmpUser } from '../../../../actions/dousers';
import IUser from "../../../../interfaces/iuser";

export class UserSidebarComponent extends React.Component<IUser> {
  // Define the props in component
  public props: any;

  public close(): void {
    this.props.setTmpUser(null);
  }

  public title(): any {
    if (this.props.user && this.props.user.id) {
      return (
        <div className="top">
          <div className="title">Editar Usuario</div>
          <div className="close" onClick={this.close.bind(this, {})}><Icon type="close"/></div>
        </div>
      );
    } else {
      return (
        <div className="top">
          <div className="title">Crear Usuario</div>
          <div className="close" onClick={this.close.bind(this, {})}><Icon type="close"/></div>
        </div>
      );
    }
  }

  public createUser(): void {
    this.props.setUser(this.props.user);
  }

  public editUser(): void {
    this.props.setUser(this.props.user);
  }

  public setName(options: any, event: any): void {
    this.props.user.name = event.target.value;
  }

  public setEmail(options: any, event: any): void {
    this.props.user.email = event.target.value;
  }

  public setPassword(options: any, event: any): void {
    this.props.user.password = event.target.value;
  }

  public setAdmin(options: any, event: any): void {
    this.props.user.admin = event.target.value;
  }

  public editButton(): any {
    if (this.props.user && this.props.user.id) {
      return (
        <Button type="primary"
          onClick={this.editUser.bind(this, {})}>Editar Usuario</Button>
      );
    }
  }

  public createButton(): any {
    if (this.props.user && !this.props.user.id) {
      return (
        <Button type="primary" 
          onClick={this.createUser.bind(this, {})}>Crear Usuario</Button>
      );
    }
  }

  public render() {
    return (
      <div className="user">
        {this.title()}
        <div className="inputs">
        <Form>
            <Form.Item className="inputs">
              <div className="label">Nombre:</div >
              <Input prefix={<Icon type="user"/>}
              placeholder="Nombre"
              defaultValue={this.props.user.name}
              type="text"
              onChange={this.setName.bind(this, {})}></Input>
            </Form.Item>
            <Form.Item className="inputs">
              <div className="label">Email:</div >
              <Input prefix={<Icon type="user"/>}
              placeholder="Email"
              defaultValue={this.props.user.email}
              type="email"
              onChange={this.setEmail.bind(this, {})}></Input>
            </Form.Item>
            <Form.Item className="inputs">
              <div className="label">Password:</div >
              <Input prefix={<Icon type="lock"/>}
                type="password"
                placeholder="Contraseña"
                defaultValue={this.props.user.password}
                onChange={this.setPassword.bind(this, {})}></Input>
            </Form.Item>
            <Form.Item className="checkbox">
              <Checkbox 
                onChange={this.setAdmin.bind(this, {})}
                defaultChecked={this.props.user.admin}
              />
              <span className="checkbox__label">¿Es Administrador?</span>
            </Form.Item>
            <Form.Item className="buttons">
              { this.createButton()}
              { this.editButton()}
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

// Configure React-redux store functions
function mapStateToProps(state: any) {
  return {
    users: state.user.list
  }
}
  
function matchDispatchToProps(dispatch: any) {
  return bindActionCreators({
    setTmpUser,
    setUser
  }, dispatch);
}
  
export default connect(mapStateToProps, matchDispatchToProps)(UserSidebarComponent);