export class MarkovStateEntity {

  constructor(edges) {
    const edgeList = Object.keys(edges)
      .map(key => {
        return {
          direction: key,
          edge: edges[key]
        };
      })
      .filter(item => item.edge !== undefined);

    const absoluteDistributions = Array(edgeList.length).fill(null).map(ele => Math.random());
    const total = absoluteDistributions.reduce((sum, value) => sum + value, 0);
    const relativeDistributions = absoluteDistributions.map(ele => ele / total);
    
    const cumulativeDistributions = [];
    let runningTotal = 0;
    for (let i = 0; i < relativeDistributions.length; i++) {
      const ele = relativeDistributions[i];
      cumulativeDistributions.push(ele + runningTotal);
      runningTotal += ele;
    }

    this.distributions = cumulativeDistributions
      .map((probability, index) => {
        return {
          edge: edgeList[index].edge,
          direction: edgeList[index].direction,
          normalProbability: relativeDistributions[index],
          cumulativeProbability: probability
        };
      })
      .sort((a, b) => a.cumulativeProbability - b.cumulativeProbability);

    const printString = this.distributions
      .map(ele => ele.normalProbability + ': ' + ele.cumulativeProbability)
      .join('\n');

  }

  getNextState() {
    const rand = Math.random();

    for (let i = 0; i < this.distributions.length; i++) {
      if (i === 0) {
        if (rand <= this.distributions[0].cumulativeProbability) {
          return this.distributions[0];
        }
        else {
          continue;
        }
      }
      if (i === this.distributions.length - 1) {
        return this.distributions[i];
      }
      if (rand > this.distributions[i - 1].cumulativeProbability && rand <= this.distributions[i].cumulativeProbability) {
        return this.distributions[i];
      }
    }

  }

  getEdgeByDirection(direction) {
    const val = this.distributions.find(distribution => distribution.direction === direction)
    return !!val ? val.normalProbability : 0;
  }

  getDistributionString() {
    return this.distributions
      .map(item => `\n   Edge: ${item.edge}, normal: ${item.normalProbability}, cum: ${item.cumulativeProbability}`)
      .join('');
  }

}