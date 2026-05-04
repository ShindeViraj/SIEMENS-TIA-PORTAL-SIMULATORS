# TIA Portal Simulator

A comprehensive, web-based simulator for Siemens S7-1200 PLC instructions, designed for educational purposes and logic verification. The simulator provides an interactive HMI interface and visual ladder logic diagrams corresponding to TIA Portal instructions.

## Overview

The simulator reproduces the behavior of various Siemens S7-1200 operations natively in the browser using HTML, CSS, and JavaScript. 

### Supported Instruction Sets:

* **Counters (`index.html`)**: CTU, CTD, CTUD
* **Timers (`timers.html`)**: TP, TON, TOF, TONR
* **Math & Compare (`dataops.html`)**: ADD, SUB, MUL, DIV, CMP >=, IN_RANGE
* **Advanced Math (`advmath.html`)**: INC, DEC, LIMIT, MIN, MAX
* **Extended Math (`extended_math.html`)**: MOD, NEG, ABS, CALCULATE
* **Floating-Point Math (`float_math.html`)**: ROUND, TRUNC, CEIL, FLOOR
* **Trigonometry Math (`trig_math.html`)**: SIN, COS, TAN, ASIN, ACOS, ATAN
* **Exponent & Fraction (`expt_frac.html`)**: SQR, SQRT, LN, EXP, EXPT, FRAC
* **Analog Scaling (`scale.html`)**: NORM_X, SCALE_X
* **Move & Shift (`move.html`)**: MOVE, SHL, SHR, ROL, ROR
* **Bit Logic (`bitlogic.html`)**: SET, RESET, SR, RS, P_TRIG, N_TRIG
* **Serialization (`serialization.html`)**: Serialize, Deserialize
* **Advanced Compare (`adv_compare.html`)**: OUT_RANGE, OK, NOT_OK, IS_NULL, IS_ARRAY

## Technologies

* Pure **HTML5** & **CSS3** (SCADA-inspired industrial aesthetics)
* **Vanilla JavaScript** (State machines and real-time DOM manipulation)
* Standardized Grid Layout with responsive module containers

## Architecture

* **HMI Panel**: Analog sliders, digital switches, and real-time LED output displays for sensory input simulation.
* **Logic Diagrams**: Visual representation of Network Ladder Logic blocks mimicking the TIA Portal UI interface.
* **Explanation Modules**: Direct extracts from the official Siemens manual summarizing exact operation behavior.

## Deployment

The project is configured to run fully client-side and can be deployed statically.
It is actively deployed via **Cloudflare Pages**.

*Maintained by Squarewave Automation Technologies Pvt. Ltd.*
