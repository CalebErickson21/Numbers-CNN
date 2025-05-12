from model import Network
import numpy as np # Used for matrix operations
import pickle # Used for saving and loading model weights and biases
import random # Used for shuffling data during training
import struct # Used for reading binary files (MNIST dataset)
import time # Measure time taken per each epoch


def load_mnist_images(filename):
    with open(filename, 'rb') as f:
        magic, num, rows, cols = struct.unpack(">IIII", f.read(16))
        images = np.frombuffer(f.read(), dtype=np.uint8).reshape(num, rows * cols)
        return [x.reshape(784, 1) / 255.0 for x in images]  # Normalize pixels to [0,1]


def load_mnist_labels(filename):
    with open(filename, 'rb') as f:
        magic, num = struct.unpack(">II", f.read(8))
        labels = np.frombuffer(f.read(), dtype=np.uint8)
        return labels


def vectorized_label(j):
    e = np.zeros((10, 1))
    e[j] = 1.0
    return e


# Load data from ./data/
train_imgs = load_mnist_images("data/train-images.idx3-ubyte")
train_labels = load_mnist_labels("data/train-labels.idx1-ubyte")
test_imgs = load_mnist_images("data/test-images.idx3-ubyte")
test_labels = load_mnist_labels("data/test-labels.idx1-ubyte")

training_data = list(zip(train_imgs, [vectorized_label(y) for y in train_labels]))
test_data = list(zip(test_imgs, test_labels))  # raw labels for evaluate()

# Initialize and train the network
net = Network([784, 32, 10])
net.SGD(training_data, epochs=20, mini_batch_size=10, eta=3.0, test_data=test_data)

# Save the trained model to a file
with open('trained_model.pkl', 'wb') as f:
    pickle.dump(net, f)