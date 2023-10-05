/**
 * Used to calculate the norm of a vector. Only takes one dimension of the vector
 * because the normed values are needed separately for each dimension.
 * @param {number} displacement
 * @param {number} distance
 */
function normVector(displacement, distance) {
  if (distance === 0) return 0;
  return displacement / distance;
}
