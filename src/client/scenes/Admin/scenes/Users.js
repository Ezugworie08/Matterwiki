import React from 'react'
import { Row, Col, Modal } from 'ui'
import Alert from 'react-s-alert'

import Loader from 'ui/loader'
import APIProvider from 'utils/APIProvider'

import { connect } from 'react-redux'

import {
  loadUsersPage,
  disposeUsersPage,
  loadEditUser,
  disposeEditUser,
  fetchUsersByPage
} from 'store/modules/sagaActions'

import ItemList from '../components/ItemList'
import ItemForm from '../components/ItemForm'

// TODO move these fellas to a nice consts file
const USER_FORM_FIELDS = [
  { name: 'name', type: 'text' },
  { name: 'about', type: 'text' },
  { name: 'email', type: 'email' },
  { name: 'password', type: 'password' }
]

const EDIT_USER_FORM_FIELDS = [
  { name: 'name', type: 'text' },
  { name: 'about', type: 'text' },
  { name: 'email', type: 'email' }
]

// TODO MangeUsers and ManageTopics are basically the same with different endpoints. Abstract!
class ManageUsers extends React.Component {
  state = {
    userId: null,
    showDeleteModal: false,
    appendingUsers: false
  };

  componentDidMount () {
    this.handleUpdate()
  }

  componentWillUnmount () {
    this.props.disposeUsersPage()
  }

  handleUpdate = () => {
    this.props.loadUsersPage()
  };

  handleEditClick = id => {
    this.props.loadEditUser(id)
  };

  handleDeleteClick = id => {
    this.setState({ showDeleteModal: true, userId: id })
  };

  confirmDelete = () => {
    APIProvider.delete(`users/${this.state.userId}`).then(() => {
      Alert.success('User has been deleted')
      this.handleUpdate()
    })
    this.closeDeleteModal()
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, userId: null })
  };

  updateUser = user => {
    const id = this.props.currentUser.id
    APIProvider.put(`users/${id}`, user).then(() => {
      Alert.success('User has been edited')
      this.props.disposeEditUser()
      this.handleUpdate()
    })
  };

  addUser = user => {
    APIProvider.post('users', user).then(() => {
      Alert.success('User has been added')
      this.handleUpdate()
    })
  };

  handleLoadMore = e => {
    e.preventDefault()
    this.setState({ appendingUsers: true })
    const { pageNumber } = this.props.usersMeta
    this.props.fetchUsersByPage(pageNumber + 1, () => {
      this.setState({ appendingUsers: false })
    })
  };

  handleUpdateCancel = () => {
    this.props.disposeEditUser()
  };

  render () {
    const { users, loading, currentUser, usersMeta } = this.props
    const { showDeleteModal, appendingUsers } = this.state
    if (loading) {
      return <Loader />
    }

    const onSubmit = currentUser ? this.updateUser : this.addUser
    const itemFormFields = currentUser ? EDIT_USER_FORM_FIELDS : USER_FORM_FIELDS
    return (
      <>
        <Row>
          <Col widthMedium='40' withSmall='100'>
            <ItemForm
              itemFormFields={itemFormFields}
              item={currentUser}
              itemName='user'
              onSubmit={onSubmit}
              onCancelUpdate={this.handleUpdateCancel}
            />
          </Col>
          <Col>
            <ItemList
              items={users}
              itemName='user'
              onDeleteClick={this.handleDeleteClick}
              onEditClick={this.handleEditClick}
              itemsMeta={usersMeta}
              onLoadMoreClick={this.handleLoadMore}
              appendingItems={appendingUsers}
            />
          </Col>
        </Row>
        <Modal
          visible={showDeleteModal}
          title='Are you sure?'
          okText='I understand, delete!'
          handleClose={this.closeDeleteModal}
          handleOk={this.confirmDelete}
        >
          Deleting the user will move all of their articles to the Admin. Are you sure?
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users.users.all,
  usersMeta: state.users.users.meta,
  loading: state.users.loading,
  currentUser: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  loadUsersPage: () => dispatch(loadUsersPage()),
  disposeUsersPage: () => dispatch(disposeUsersPage()),
  loadEditUser: id => dispatch(loadEditUser(id)),
  disposeEditUser: () => dispatch(disposeEditUser()),
  fetchUsersByPage: (page, callback) => dispatch(fetchUsersByPage(page, callback))
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers)
