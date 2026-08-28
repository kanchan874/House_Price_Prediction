# Explainable AI (XAI) Methodology

This document details the mathematical formulations and algorithms behind our local and global explainability dashboards.

---

## 1. Linear Regression Local Explanations
For a standard Linear Regression model, the prediction is computed as:
$$y_{pred} = \beta_0 + \sum_{k=1}^{D} \beta_k x_k$$

Where:
- $\beta_0$ is the intercept (baseline model value when all preprocessed inputs are zero).
- $\beta_k$ is the coefficient of the preprocessed feature $k$.
- $x_k$ is the numerical value of the preprocessed feature.

The **local contribution** $C_k$ of feature $k$ is calculated directly as:
$$C_k = \beta_k x_k$$

To map these back to the original 15 user-facing features, we sum the contributions of all preprocessed columns that belong to the same parent feature (e.g. summing the contribution of One-Hot Encoded neighborhood columns).

---

## 2. Explainable Boosting Machines (EBM)
Explainable Boosting Machines (EBMs), developed by Microsoft Research, are Generalized Additive Models (GAMs) of the form:
$$g(E[y]) = \beta_0 + \sum_{j=1}^{P} f_j(x_j)$$

Where:
- $g$ is the link function (identity for regression).
- $\beta_0$ is the baseline intercept.
- $f_j(x_j)$ is the univariate shape function for feature $j$, trained using gradient boosting on small decision trees (with a low learning rate).

### Key Mathematical Advantages:
1. **Perfect Additivity:** Because each $f_j$ is evaluated independently on $x_j$, the contribution of feature $j$ to the prediction is exactly $f_j(x_j)$. The sum of all shape values plus the intercept equals the final prediction.
2. **Non-linearity:** Unlike Linear Regression, $f_j(x_j)$ can be a complex step-function, allowing EBM to fit curvilinear responses (like price jumps based on quality tiers or flat points on garage capacity).
3. **No Interactions (Interactivity=0):** By training EBM with interaction terms disabled, we prevent terms of the form $f_{j,k}(x_j, x_k)$. This ensures that 100% of the prediction is attributable to individual features, removing explanation ambiguity.

---

## 3. SHAP (Shapley Additive exPlanations) for Random Forest
Random Forest is a black-box ensemble of decision trees. Since it is non-additive, we cannot extract local contributions directly. Instead, we use **SHAP** values based on cooperative game theory.

A prediction is modeled as a game where features are players, and the prediction value is the payout. The SHAP value $\phi_i$ of feature $i$ is its average marginal contribution over all possible coalitions of features:
$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \Big( f_x(S \cup \{i\}) - f_x(S) \Big)$$

Where:
- $F$ is the set of all features.
- $S$ is a subset of features excluding feature $i$.
- $f_x(S)$ is the model's expected prediction given the features in $S$.

### Properties of SHAP values:
1. **Efficiency (Additivity):** The sum of the SHAP values of all features equals the difference between the model's prediction and the expected base value:
   $$y_{pred} = E[f(x)] + \sum_{j=1}^{P} \phi_j$$
   This matches EBM's additive intercept structure, allowing a unified local explanation UI!
2. **Symmetry:** If two features contribute equally to all coalitions, their SHAP values are identical.

---

## 4. What-If Analysis
What-if analysis evaluates:
$$\Delta y = f(x_{modified}) - f(x_{original})$$

Rather than simulating these changes on the frontend using linear weights, our dashboard sends both original and modified feature vectors to the backend. The API executes standard model inference for both states, returning the exact, model-calculated price difference and percentage shift.
