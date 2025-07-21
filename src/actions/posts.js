// src/posts.js
import { supabase } from '../supabaseClient'

// Redux Action Types
export const CREATE_POST_INITIAL = 'CREATE_POST_INITIAL';
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_FAILURE = 'CREATE_POST_FAILURE';
export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

// Action Creators
function createPostInitial() {
  return { type: CREATE_POST_INITIAL, isFetching: false };
}

function requestCreatePost(post) {
  return { type: CREATE_POST_REQUEST, isFetching: true, post };
}

function createPostSuccess(post) {
  return { type: CREATE_POST_SUCCESS, isFetching: false, post };
}

function createPostError(message) {
  return { type: CREATE_POST_FAILURE, isFetching: false, message };
}

function requestFetchPosts() {
  return { type: FETCH_POSTS_REQUEST, isFetching: true };
}

function fetchPostsSuccess(posts) {
  return { type: FETCH_POSTS_SUCCESS, isFetching: false, posts };
}

function fetchPostsError(message) {
  return { type: FETCH_POSTS_FAILURE, isFetching: false, message };
}

// 🔁 Reusable Supabase Helpers
export async function createRecord(table, data) {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert([data])
    .select();

  if (error) {
    console.error(`Error inserting into ${table}:`, error.message);
    throw error;
  }

  return insertedData[0];
}

export async function selectRecords(table, columns = '*', filter = {}) {
  let query = supabase.from(table).select(columns);
  for (const key in filter) {
    query = query.eq(key, filter[key]);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error selecting from ${table}:`, error.message);
    throw error;
  }

  return data;
}

export async function updateRecord(table, match, changes) {
  const { data, error } = await supabase
    .from(table)
    .update(changes)
    .match(match)
    .select();

  if (error) {
    console.error(`Error updating ${table}:`, error.message);
    throw error;
  }

  return data;
}

export async function deleteRecord(table, match) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .match(match);

  if (error) {
    console.error(`Error deleting from ${table}:`, error.message);
    throw error;
  }

  return data;
}

// 🔁 Thunk: Create Post (for 'post' table)
export function createPost(postData) {
  return async dispatch => {
    dispatch(requestCreatePost(postData));

    try {
      const createdPost = await createRecord('post', postData);
      dispatch(createPostSuccess(createdPost));

      setTimeout(() => {
        dispatch(createPostInitial());
      }, 5000);

      return createdPost;
    } catch (error) {
      dispatch(createPostError(error.message));
      return Promise.reject(error);
    }
  };
}

// 🔁 Thunk: Fetch Posts (for 'post' table)
export function fetchPosts() {
  return async dispatch => {
    dispatch(requestFetchPosts());

    try {
      const posts = await selectRecords('post', 'id');
      dispatch(fetchPostsSuccess(posts));
      return posts;
    } catch (error) {
      dispatch(fetchPostsError(error.message));
      return Promise.reject(error);
    }
  };
}

// 🔁 Thunk: Update Post (generic)
export function updatePost(table, match, changes) {
  return async dispatch => {
    dispatch({ type: CREATE_POST_REQUEST, isFetching: true });

    try {
      const updated = await updateRecord(table, match, changes);
      dispatch({ type: CREATE_POST_SUCCESS, isFetching: false, post: updated[0] });
      return updated[0];
    } catch (error) {
      dispatch({ type: CREATE_POST_FAILURE, isFetching: false, message: error.message });
      return Promise.reject(error);
    }
  };
}

// 🔁 Thunk: Delete Post (generic)
export function deletePost(table, match) {
  return async dispatch => {
    dispatch({ type: CREATE_POST_REQUEST, isFetching: true });

    try {
      const deleted = await deleteRecord(table, match);
      dispatch({ type: CREATE_POST_SUCCESS, isFetching: false, post: deleted[0] });
      return deleted[0];
    } catch (error) {
      dispatch({ type: CREATE_POST_FAILURE, isFetching: false, message: error.message });
      return Promise.reject(error);
    }
  };
}
