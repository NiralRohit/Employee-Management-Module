const Employee = require('../models/Employee');
const path = require('path');
const fs = require('fs');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    let query = { createdBy: req.user.id };
    
    // Search by name, email, position, or department
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = {
        ...query,
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { position: searchRegex },
          { department: searchRegex }
        ]
      };
    }
    
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Missing'
      });
    }
    
    // Make sure user is employee owner
    if (employee.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    // If file was uploaded, add to req.body
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }
    
    const employee = await Employee.create(req.body);
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Missing'
      });
    }
    
    // Make sure user is employee owner
    if (employee.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // If new file was uploaded
    if (req.file) {
      // Delete old image if not default
      if (employee.profileImage !== 'default.jpg') {
        const imagePath = path.join(__dirname, '../uploads', employee.profileImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      req.body.profileImage = req.file.filename;
    }
    
    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Missing'
      });
    }
    
    // Make sure user is employee owner
    if (employee.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Delete profile image if not default
    if (employee.profileImage !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../uploads', employee.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await employee.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
}; 