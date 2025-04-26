# Import dependencies
import random # Used for shuffling data during training
import time # Measure time taken per each epoch
import numpy as np # Used for matrix operations

# Define neural network class
class Network(object):

    # Constructor to initialize the neural network with given sizes - automatically called when creating a network instance
    #  sizes: list of integers representing the number of neurons in each layer - ex. [input layer, hidden layer(s), output layer]
    def __init__(self, sizes):

        self.num_layers = len(sizes) # Set number of layers in network
        self.sizes = sizes # Set sizes of each layer
        self.biases = [np.random.randn(y, 1) for y in sizes[1:]] # Initialize random biases for each layer (except input layer, hence sizes[1:])

        # Initialize random weights for each layer
        # zip(sizes[:-1], sizes[1:]) pairs each layer with the next layer, creating a list of tuples (x, y) where x is current layer nuerons and y is next layer neuron
        # np.random.randn(y, x) creates a matrix of shape (y, x) # Rows = current layer neuron, columns = previouis layer neuron connections
        self.weights = [np.random.randn(y, x) for x, y in zip(sizes[:-1], sizes[1:])] # Each weight matrix has shape (y, x) y = rows, x = columns


    # Takes input vector and returns the output of the network
    def feedforward(self, a):
        # For each layer, compute the weighted input (z = wa + b), apply the sigmoid function, and return activation to next layer
        for b, w in zip(self.biases, self.weights): # Loop over each layer's weights and biases
            a = sigmoid(np.dot(w, a)+b) # np.dot(w, a) is matrix-vector multiplication, b is added to each element of the resulting vector
        return a


    # Stochastic Gradient Descent (SGD) method to train the network
    # training_data: list of tuples (x, y) where x is input vector and y is expected output
    # epochs: number of iterations over the training data
    # mini_batch_size: size of each mini-batch for training
    # eta: learning rate
    # test_data: optional, used to evaluate the network after each epoch
    def SGD(self, training_data, epochs, mini_batch_size, eta, test_data=None):
        #  If test-data is provided,set n to length of test_data
        if test_data: 
            n_test = len(test_data)

        # Set n to length of training_data
        n = len(training_data)

        # For each epoch, shuffle the training data and create mini-batches
        for j in range(epochs):
            time1 = time.time() # STart time for epoch
            random.shuffle(training_data) # Shuffle training data

            # Create mini-batches of training data
            mini_batches = [ training_data[k:k+mini_batch_size] for k in range(0, n, mini_batch_size) ]

            # For each mini-batch, update weights and biases using gradient descent
            for mini_batch in mini_batches:
                self.update_mini_batch(mini_batch, eta)
            
            time2 = time.time() # End time for epoch

            # If test data is provided, evaluate network on test data
            if test_data:
                print("Epoch {0}: {1} / {2}, took {3:.2f} seconds".format(j, self.evaluate(test_data), n_test, time2-time1))
            # Else print time for epoch training iteration
            else:
                print("Epoch {0} complete in {1:.2f} seconds".format(j, time2-time1))


    # Perform backpropagation to update weights and biases using gradient descent
    # mini_batch: list of tuples (x, y) where x is input vector and y is expected output
    # eta: learning rate
    def update_mini_batch(self, mini_batch, eta):
        # Initialize gradient accumulators for weights and biases - (0 matricies)
        nabla_w = [np.zeros(w.shape) for w in self.weights] # Same shape as weights matrix
        nabla_b = [np.zeros(b.shape) for b in self.biases] # Same shape as bias matrix

        # x is input, y is correct output
        for x, y in mini_batch: 
            # Calculate gradients for each example in the mini-batch
            delta_nabla_b, delta_nabla_w = self.backprop(x, y)

            # Accumulate gradients over the entire mini-batch as a whole
            nabla_w = [nw+dnw for nw, dnw in zip(nabla_w, delta_nabla_w)] # Store cumulative gradients for cost function with respect to each weight
            nabla_b = [nb+dnb for nb, dnb in zip(nabla_b, delta_nabla_b)] # Store cumulative gradients for cost function with respect to each bias

        # Apply average gradient to update weights and biases
        self.weights = [w-(eta/len(mini_batch))*nw for w, nw in zip(self.weights, nabla_w)] # Average out the cumulative weight gradients (nabla_w) and apply to current weight matrix 
        self.biases = [b-(eta/len(mini_batch))*nb for b, nb in zip(self.biases, nabla_b)] # Average out the cumulative bias gradients (nabla_b) and apply to current bias matrix


    # Perform backpropagation to calculate gradients for weights and biase
    # x: input vector
    # y: expected output vector
    def backprop(self, x, y):

        nabla_w = [np.zeros(w.shape) for w in self.weights] # Same shape as weights matrix, nabla_w[i] = partial derivative of cost function with respect to weight matrix for layer i + 1
        nabla_b = [np.zeros(b.shape) for b in self.biases] # Same shape as bias matrix, nabla_b[i] = partial derivative of cost function with respect to bias maatrix for layer i + 1
        
        # Store intermediate activations and z vectors (weighted inputs)
        activation = x # Starts as input vector x
        activations = [x] # List to store all the activations, layer by layer
        zs = [] # List to store all the raw weighted inputs, layer by layer

        # Forward pass: compute activations and z vectors for each layer
        for b, w in zip(self.biases, self.weights):
            z = np.dot(w, activation)+b # Matrix multiplication, (weight)(bias) + activation
            zs.append(z) # Append z to vector list
            activation = sigmoid(z) # Apply sigmoid activation function to z
            activations.append(activation) # Append activation to vector list
        
        # Compute error (delta) for the output layer
        delta = self.cost_derivative(activations[-1], y) * sigmoid_prime(zs[-1]) # activations[-1] is output layer activation, y is expected output, zs[-1] is last z
        
        # Gradient for the output layer
        nabla_b[-1] = delta # Bias gradients for output layer
        nabla_w[-1] = np.dot(delta, activations[-2].transpose()) # Gradient of cost with respect to weights going into output layer # activations[-2] is layer before output layer
        
        # Backward pass: iterate through layers in reverse order to compute gradients
        for l in range(2, self.num_layers):
            z = zs[-l] # Count backward through z vectors
            sp = sigmoid_prime(z) # Compute derivative of sigmoid function for current layer
            delta = np.dot(self.weights[-l+1].transpose(), delta) * sp # Propagate error backward through the network
            nabla_b[-l] = delta # Update bias gradients for current layer
            nabla_w[-l] = np.dot(delta, activations[-l-1].transpose()) # Update weight gradients for current layer # activations]-l-1] is layer before current layer

        # Return the gradients for biases and weights
        return (nabla_b, nabla_w)


    # Test model accuracy on test data
    def evaluate(self, test_data):
        # Predict class via highest activation value on output layer
        # Compare prediction to label
        test_results = [(np.argmax(self.feedforward(x)), y) for (x, y) in test_data]
        return sum(int(x == y) for (x, y) in test_results)


    # Deriviative of the cost function (mean squared error)
    def cost_derivative(self, output_activations, y):
        return (output_activations-y)


# Sigmoid function squashes input to range (0, 1)
def sigmoid(z):
    return 1.0/(1.0+np.exp(-z))

# Derivative of the sigmoid function, used for backpropagation
def sigmoid_prime(z):
    return sigmoid(z)*(1-sigmoid(z))
