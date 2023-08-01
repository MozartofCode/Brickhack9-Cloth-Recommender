# File: AI.py
# Author: Bertan Berker
# Language: Python
# This file includes the function that perform AI related tasks for the backend


import os
# Suppress TensorFlow log output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from keras.applications.vgg16 import VGG16
from keras.preprocessing.image import load_img, img_to_array
from keras.applications.vgg16 import preprocess_input, decode_predictions
import numpy as np
import cv2
import json
import sys
import tensorflow as tf

# Disable tf messages
tf.keras.utils.disable_interactive_logging()


def find_cloth(image):

    # Load the VGG model
    model = VGG16()

    # Load the image and preprocess it
    img = load_img(image, target_size=(224, 224))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)

    # Make predictions and decode them
    preds = model.predict(img)
    decoded_preds = decode_predictions(preds, top=1)[0]

    # Print the predictions
    for pred in decoded_preds:
        return pred[1]



def find_color(image):
    # Load image and convert to HSV color space
    img = cv2.imread(image)
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Define color ranges
    color_ranges = {
        'red': ([0, 100, 100], [10, 255, 255]),
        'orange': ([11, 100, 100], [20, 255, 255]),
        'yellow': ([21, 100, 100], [30, 255, 255]),
        'green': ([31, 100, 100], [70, 255, 255]),
        'blue': ([101, 100, 100], [130, 255, 255]),
        'purple': ([131, 100, 100], [155, 255, 255]),
        'pink': ([156, 100, 100], [180, 255, 255]),
        'white': ([0, 0, 200], [180, 30, 255]),
        'black': ([0, 0, 0], [180, 30, 100])   
    }

    # Iterate over color ranges and find the dominant color in the image
    max_area = 0
    dominant_color = None
    for color, (lower, upper) in color_ranges.items():
        mask = cv2.inRange(hsv_img, np.array(lower), np.array(upper))
        area = cv2.countNonZero(mask)
        if area > max_area:
            max_area = area
            dominant_color = color

    # Print the dominant color

    return dominant_color


# Get the image path from the command-line argument
image_path = sys.argv[1]

# Call the functions to find the cloth and color from the image
cloth = find_cloth(image_path)
color = find_color(image_path)

# Create a dictionary with the color and cloth information
response_data = {
    "color": color,
    "cloth": cloth
}

# Convert the dictionary to a JSON string and print it to stdout
response_json = json.dumps(response_data)
sys.stdout.write(response_json)


