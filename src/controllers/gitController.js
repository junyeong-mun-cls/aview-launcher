const { isValidBranchName } = require('../utils/validator');
const { switchAndPullBranch } = require('../services/gitService');

async function switchAndPull(req, res) {
  const branch = (req.body.branch || '').trim();

  if (!branch) {
    return res.status(400).json({
      ok: false,
      message: 'Branch is required.',
    });
  }

  if (!isValidBranchName(branch)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid branch name.',
    });
  }

  try {
    const result = await switchAndPullBranch(branch);

    if (!result.ok) {
      return res.status(500).json(result);
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Unexpected server error.',
      error: error.message,
    });
  }
}

module.exports = {
  switchAndPull,
};