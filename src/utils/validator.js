function isValidBranchName (branch) {
  return /^[A-Za-z0-9._/-]+$/.test(branch)
}

module.exports = {isValidBranchName}
