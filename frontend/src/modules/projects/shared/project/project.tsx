import * as React from 'react';
import './project.scss';
import 'antd/dist/antd.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Icon, Progress, Tooltip, Tag, Button, Modal } from 'antd';
import { User } from '../../../../models/user';
import { Dataset } from '../../../../models/dataset';
import { destroyProject } from '../../../../actions/doprojects';

export class ProjectComponent extends React.Component<any> {

  // Define the props in component
  public props: any;

  public showUsers(): any {
    return (
      this.props.project.users.map((user: User) => {
        return (
          <Tooltip placement="top" title={user.name} key={user.id}>
            <div className="user__portrait">
              <Icon type="user" />
            </div>
          </Tooltip>
        )
      })
    )
  }

  public total(): number {
    return this.props.project.assignated + this.props.project.free_pool + 
    this.props.project.free_pool_done + this.props.project.assignated_done; 
  }

  public done(): number {
    return this.props.project.assignated_done + this.props.project.free_pool_done;
  }

  public progress(): number {
    if (this.done() > 0) {
      return Math.floor(this.done() / this.total()  * 100);
    } else {
      return 0;
    } 
  }

  public showDatasets(): any {
    return (
      this.props.project.datasets.map((dataset: Dataset) => {
        return <Tag color="orange" key={dataset.id}>{dataset.name}</Tag>
      })
    )
  }

  public delete(): void {
    let self = this;
    Modal.confirm({
      title: 'Desea eliminar este proyecto?',
      content: 'Se eliminar el proyecto y su progreso',
      onOk() {
        self.props.destroyProject(self.props.project);
      }
    });
  }

  public render() {
    return (
      <div className="project">
        <div className="project__name">
          <Tooltip placement="top" title={this.props.project.description}>
            {this.props.project.name}
          </Tooltip>
        </div>
        <div className="project__datasets">{this.showDatasets()}</div>
        <div className="project__users">{this.showUsers()}</div>
        <div className="project__progress">
          <div className="elements">
            {this.done()}/{this.total()} Completados
          </div>
          <Progress percent={this.progress()} />
        </div>
        <div className="project__actions">
          <Button className="space"><Icon type="usergroup-add" />Asignar</Button>
          <Link to={`/projects/${this.props.project.id}`}>
            <Button type="primary" className="space"><Icon type="edit" />
              Editar
            </Button>
          </Link>
          <Button type="danger" onClick={this.delete.bind(this)}>
            <Icon type="delete" /> Eliminar
          </Button>
        </div>
      </div>
    )
  }
}

// Configure React-redux store functions
function mapStateToProps(state: any) {
    return {
    }
  }
  
  function matchDispatchToProps(dispatch: any) {
    return bindActionCreators({
      destroyProject
    }, dispatch);
  }
  
export default connect(mapStateToProps, matchDispatchToProps)(withRouter(ProjectComponent));