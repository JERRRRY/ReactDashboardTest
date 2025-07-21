import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

class SimpleLineChart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,  // Month label, e.g. "Jul 2025"
        users: PropTypes.number.isRequired, // Count of users
      })
    ).isRequired,
  };

  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={this.props.data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />         {/* Month as X-axis */}
        <YAxis />                         {/* Users as Y-axis */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#5d80f9" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>

    );
  }
}

export default SimpleLineChart;
