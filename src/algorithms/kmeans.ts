type Point = number[];

// 欧氏距离
function distance(a: Point, b: Point): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// KMeans++ 初始化中心点
function initCentroids(points: Point[], k: number): Point[] {
  // 随机选择一个点作为第一个中心点
  const centroids: Point[] = [points[Math.floor(Math.random() * points.length)]];

  // 继续选择剩余的中心点
  while (centroids.length < k) {
    // 计算每个点到最近中心点的距离
    const distances = points.map((point) => {
      return Math.min(...centroids.map((centroid) => distance(point, centroid)));
    });

    // 计算总距离
    const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);

    // 计算每个点被选为下一个中心点的概率
    const probabilities = distances.map((dist) => dist / totalDistance);

    // 计算累积概率
    const cumulProbabilities = probabilities.map((_, i) => {
      return probabilities.slice(0, i + 1).reduce((sum, p) => sum + p, 0);
    });

    // 根据累积概率随机选择一个点作为下一个中心点
    const randomValue = Math.random();
    const selectedIndex = cumulProbabilities.findIndex((cp) => cp >= randomValue);

    centroids.push(points[selectedIndex]);
  }

  return centroids;
}

// 分配每个点到最近的中心点
function assignPoints(centroids: Point[], points: Point[]) {
  const clusters: Point[][] = Array.from(centroids, () => []);

  points.forEach((point) => {
    const [, clusterIndex] = centroids.reduce(
      ([minDist, clusterIndex], centroid, index) => {
        const dist = distance(point, centroid);
        if (dist < minDist) {
          return [dist, index];
        }
        return [minDist, clusterIndex];
      },
      [Infinity, 0]
    );

    clusters[clusterIndex].push(point);
  });

  return clusters;
}

function updateCentroids(centroids: Point[], clusters: Point[][]) {
  return clusters.map((cluster) => {
    if (cluster.length === 0) {
      // 如果簇为空，随机选择一个中心点
      return centroids[Math.floor(Math.random() * centroids.length)];
    }

    // 计算簇的均值
    const centroid = cluster[0].map((_, i) => {
      return cluster.reduce((sum, point) => sum + point[i], 0) / cluster.length;
    });

    return centroid;
  });
}

// KMeans 算法实现
export function kmeans(points: Point[], k: number, maxIterations: number = 100): Point[][] {
  let centroids = initCentroids(points, k);
  let clusters = Array.from({ length: k }, (): Point[] => []);

  for (let iter = 0; iter < maxIterations; iter++) {
    const updatedClusters = assignPoints(centroids, points);
    const updatedCentroids = updateCentroids(centroids, updatedClusters);

    centroids = updatedCentroids;
    clusters = updatedClusters;

    if (centroids.every((centroid, i) => distance(centroid, updatedCentroids[i]) < 1e-6)) {
      break;
    }
  }

  return clusters;
}
