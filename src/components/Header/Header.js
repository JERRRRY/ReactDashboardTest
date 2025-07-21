/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import {
  createPost,
  fetchPosts,
  updatePost,
  deletePost,
} from '../../actions/posts';

import { connect } from 'react-redux';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Nav,
  NavItem,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import Icon from '../Icon';

import photo from '../../images/photo.jpg';
import { logoutUser } from '../../actions/user';
import s from './Header.module.scss';




class Header extends React.Component {
/*
  handleCreatePost = async () => {
  const { dispatch } = this.props;
  const table = 'post';

  try {
    
    // 1. Insert
    const newPost = await dispatch(
      createPost({
        title: 'Test Post from Header',
        content: 'Created via Supabase test button',
      })
    );
    console.log('✅ Post Created:', newPost);

    
    // 2. Select
    const allPosts = await dispatch(fetchPosts());
    console.log('📖 All Posts:', allPosts);

    // 3. Update (use ID of created post)
    const updated = await dispatch(
      updatePost(table, { id: newPost.id }, { title: 'Updated Title from Header' })
    );
    console.log('✏️ Post Updated:', updated);

    // 4. Delete
    const deleted = await dispatch(deletePost(table, { id: newPost.id }));
    console.log('🗑️ Post Deleted:', deleted);

    // Final check
    const finalPosts = await dispatch(fetchPosts());
    console.log('📦 Final Posts After Deletion:', finalPosts);
    
  } catch (error) {
    console.error('❌ Supabase CRUD Error:', error.message);
  }
  };


          <NavItem className={cx('', s.headerIcon)}>
          <Button color="info" onClick={this.handleCreatePost}>
            <Icon glyph="add" /> Test Post
          </Button>
          </NavItem>
          
*/

  static propTypes = {
    sidebarToggle: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarToggle: () => {},
  };

  state = { isOpen: false };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  doLogout = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const {isOpen} = this.state;
    return (
      <Navbar className={s.root}>
        <Nav>
          <NavItem
            className={cx('visible-xs mr-4 d-sm-up-none', s.headerIcon, s.sidebarToggler)}
            href="#"
            onClick={this.props.sidebarToggle}
          >
            <i className="fa fa-bars fa-2x text-muted" />
          </NavItem>
          <NavItem>
            <InputGroup>
              <Input placeholder="Search for..." />
              <InputGroupAddon addonType="append" className="px-2">
                <i className="fa fa-search" />
              </InputGroupAddon>
            </InputGroup>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    init: state.runtime.initialNow,
  };
}
export default connect(mapStateToProps)(Header);


