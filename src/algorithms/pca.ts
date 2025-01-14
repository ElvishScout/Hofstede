import {
  matrix,
  Matrix,
  multiply,
  transpose,
  eigs,
  MathArray,
  std,
  mean,
  subtract,
  dotDivide,
} from "mathjs";

export function pca(data: number[][], n: number) {
  // 将数据转换为矩阵
  const dataMatrix = matrix(data);
  // 计算均值
  const dataMean = mean(dataMatrix, 0);
  // 计算标准差
  const dataStd = std(dataMatrix, 0);
  // 标准化数据
  const standardlizedData = dotDivide(subtract(dataMatrix, dataMean), dataStd) as unknown as Matrix;
  // 计算协方差矩阵
  const covarianceMatrix = multiply(transpose(standardlizedData), standardlizedData);
  // 计算特征向量
  const { eigenvectors } = eigs(covarianceMatrix);
  // 选择前 n 个特征向量
  const topEigenVectors = eigenvectors
    .sort(({ value: v1 }, { value: v2 }) => (v2 as number) - (v1 as number))
    .slice(0, n);
  const eigenMat = transpose(matrix(topEigenVectors.map(({ vector }) => vector as MathArray)));
  // 将数据投影到新的低维空间
  const transformedData = multiply(standardlizedData, eigenMat);

  return transformedData.toArray() as number[][];
}
