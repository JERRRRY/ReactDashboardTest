// src/pages/charts/index.js

import React, { PureComponent } from 'react';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import { format, parseISO } from 'date-fns';

import Widget from '../../components/Widget';
import SimpleLineChart from './charts/LineChart';
import PercentAreaChart from './charts/PercentAreaChart';
import CustomPieChart from './charts/PieChart';
import SingleBarChart from './charts/SingleBarChart';

import { supabase } from '../../supabaseClient';

class Charts extends PureComponent {
  state = {
    chartData: [],
  };

  async componentDidMount() {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('rating, session_created_at, session_id, feedback_created_at');

      if (error) {
        console.error('❌ Error loading user ratings:', error.message);
        return;
      } 
      // Count ratings
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(user => {
        const rating = user.rating;
        
        if (ratingCounts[rating] !== undefined) {
          ratingCounts[rating]++;
        }
      });

      const rateData = Object.keys(ratingCounts).map(rating => ({
      name: `Rating ${rating}`,
      users: ratingCounts[rating],
      }));

      this.setState({ rateData });

      //count ppl per month
      const monthlyCounts = {};
      if (!data || data.length === 0) {
        console.warn('⚠️ No user data found.');
        return;
      }
      data.forEach(user => {
        if (!user.session_created_at) return;
        const date = parseISO(user.session_created_at);
        const month = format(date, 'MMM'); 

        if (!monthlyCounts[month]) {
          monthlyCounts[month] = 0;
        }
        monthlyCounts[month]++;
      });

      
      const lineChartData = Object.keys(monthlyCounts).map(month => ({
        name: month,
        users: monthlyCounts[month],
      }));
      
      const dummy = [
        { month: 'Jan', users: 3 },
        { month: 'Feb', users: 7 },
        { month: 'Mar', users: 4 },
      ];

      this.setState({ lineChartData });

      //count how many times open the game in one section
      const counts = {};
      data.forEach(row => {
        const sessionId = row.session_id;
        if (sessionId) {
          counts[sessionId] = (counts[sessionId] || 0) + 1;
        }
      });

      const duplicateFrequency = {};
      Object.values(counts).forEach(count => {
        if (count > 1) {
          duplicateFrequency[count] = (duplicateFrequency[count] || 0) + 1;
        }
      });

      const GameChartData = Object.entries(duplicateFrequency).map(([dupCount, sessionCount]) => ({
        name: ` ${dupCount} games`,
        users: sessionCount,
      }));

      this.setState({ GameChartData });

      let completed = 0;
      let notCompleted = 0;

      data.forEach(user => {
        if (user.feedback_created_at) {
          completed++;
        } else {
          notCompleted++;
        }
      });

      const surveyChartData = [
        { name: 'Completed Survey', value: completed },
        { name: 'Not Completed', value: notCompleted },
      ];

      this.setState({ surveyChartData });


    } catch (error) {
      console.error('❌ Failed to load ratings:', error.message);
    }
  }

  render() {
    const { surveyChartData, GameChartData, lineChartData, rateData } = this.state;

    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem active>Charts</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="page-title mb-lg"><span className="fw-semi-bold">Dashboard</span></h1>
        <Row>
          <Col xs={12} md={6}>
            <Widget title={<h5><span className="fw-semi-bold">Ratings</span></h5>}>
              <SingleBarChart data={rateData} />
            </Widget>
          </Col>
          <Col xs={12} md={6}>
          <Widget title={<h5><span className="fw-semi-bold">Users per Month </span></h5>}>
            <SimpleLineChart data={lineChartData} />
          </Widget>
          </Col>
          <Col xs={12} md={6}>
          <Widget title={<h5><span className="fw-semi-bold">Play how many times</span></h5>}>
            <SimpleLineChart data={GameChartData} />
          </Widget>
          </Col>
          <Col xs={12} md={6}>
            <Widget title={<h5><span className="fw-semi-bold">Survey</span></h5>}>
              <CustomPieChart data={surveyChartData} />
            </Widget>
          </Col>
        </Row>
        
      </div>
    );
  }
}

export default connect()(Charts);
