import React from 'react';

const ScoreTable = ({data}) => {
    // Sample data to test
const scoreData = data?.score
  return (
    <div className="score-table-container">
      <h2>Score: {scoreData?.score}</h2>
      <h2>Percentile: {data?.percentile}</h2>
      <table className="score-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Add or Subtract</th>
            <th>Weight</th>
            <th>Compare To</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {scoreData?.scoreDetails.map((detail, index) => (<>
            <tr key={index}>
              <td>{detail?.field}</td>
              <td>{detail?.addOrSub}</td>
              <td>{detail?.weight}</td>
              <td>{detail?.compareTo.join(', ')}</td>
              <td>{detail?.betweenValue}</td>
            </tr>
          </>
          ))}
        </tbody>
      </table>
    </div>
  );

};



export default ScoreTable
