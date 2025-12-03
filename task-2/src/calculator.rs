///-------------------------------------------------------------------------------
///
/// This is your calculator implementation task 
/// to practice enums, structs, and methods.
/// 
/// Complete the implementation of the Calculator struct and its methods.
/// 
/// The calculator should support basic arithmetic 
/// operations (addition, subtraction, multiplication)
/// with overflow protection and maintain a history 
/// of operations.
/// 
/// Tasks:
/// 1. Implement the OperationType enum methods
/// 2. Implement the Operation struct constructor
/// 3. Implement all Calculator methods
/// 
///-------------------------------------------------------------------------------

#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication
}

impl OperationType {
    // TODO: Return the string representation of the operation sign
    // Addition -> "+", Subtraction -> "-", Multiplication -> "*"
    pub fn get_sign(&self) -> &str {
        match self {
            Self::Addition => "+",
            Self::Subtraction => "-",
            Self::Multiplication => "*", 
        }
    }
    
    // TODO: Perform the operation on two i64 numbers with overflow protection
    // Return Some(result) on success, None on overflow
    //
    // Example: OperationType::Multiplication.perform(x, y)
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {

        match self.get_sign() {
            "+" => x.checked_add(y), 
            "-" => x.checked_sub(y),
            "*" => x.checked_mul(y),
            _ => None

        }

    }
}

#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType
}

impl Operation {
    // TODO: Create a new Operation with the given parameters
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        
        Self {
            first_num,
            second_num,
            operation_type
        }

    }
}

pub struct Calculator {
    pub history: Vec<Operation>
}

impl Calculator {
    // TODO: Create a new Calculator with empty history
    pub fn new() -> Self {
        Self {
            history: vec![]
        }
    }
    
    // TODO: Perform addition and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation = Operation::new(x, y, OperationType::Addition);
        let compute = operation.operation_type.perform(x, y);
        match compute {
            Some(_value) => {
                self.history.push(operation);
                compute

            }, 
            _ => None
        }
    }
    
    // TODO: Perform subtraction and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation = Operation::new(x, y, OperationType::Subtraction);
        let compute = operation.operation_type.perform(x, y);
        match compute {
            Some(_value) => {
                self.history.push(operation);
                compute

            }, 
            _ => None
            }
    }
    
    // TODO: Perform multiplication and store successful operations in history
    // Return Some(result) on success, None on overflow
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        let operation = Operation::new(x, y, OperationType::Multiplication);
        let compute = operation.operation_type.perform(x, y);
        match compute {
            Some(_value) => {
                self.history.push(operation);
                compute

            }, 
            _ => None
        }
    }
    
    // TODO: Generate a formatted string showing all operations in history
    // Format: "index: first_num operation_sign second_num = result\n"
    //
    // Example: "0: 5 + 3 = 8\n1: 10 - 2 = 8\n"
    pub fn show_history(&self) -> String{
        let mut my_operations = String::new();
        let mut index = 0;
        for operation in &self.history {
            let result = operation.operation_type.perform(operation.first_num, operation.second_num).unwrap();
            my_operations.push_str(format!("{index}: {} {} {} = {}\n", operation.first_num, operation.operation_type.get_sign(), operation.second_num, result).as_str());
            index += 1;
        }

        my_operations
    }
    
    // TODO: Repeat an operation from history by index
    // Add the repeated operation to history and return the result
    // Return None if the index is invalid
    pub fn repeat(&mut self, operation_index: usize) -> Option<i64>{
        
        match self.history.get(operation_index) {
            Some(operation) => {
                let result = operation.operation_type.perform(operation.first_num, operation.second_num);
                self.history.push(operation.clone());
                result
            }, 
            None => None
        }

    }
    
    // TODO: Clear all operations from history
    pub fn clear_history(&mut self) {
        self.history.clear();
    }
}
