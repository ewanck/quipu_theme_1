<?php
/**
 * @file
 * Returns the HTML for a single Drupal page.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728148
 */
?>

<?php
//  drupal_add_library('popcornjs', 'popcornjs');
  drupal_add_js(drupal_get_path('theme', 'quipu_theme_1') . '/js/popcorn.min.js');
  drupal_add_js(drupal_get_path('theme', 'quipu_theme_1') . '/js/subtitle.js');
  drupal_add_css(drupal_get_path('theme', 'quipu_theme_1') . '/css/player.css', array('group' => CSS_THEME, 'type' => 'file'));
?>

<div id="page" style="margin-left:0px;">
  <?php print render($page['content']); ?>
</div>

<div id="audio-player-wrapper" style="position:fixed; left:0px; margin-left:0px; top:0px; width:100%;">
  <div id="subtitle-container"></div>
  <div id="player-close-btn"></div>
  <div id="src-icon"></div>
  <canvas id="player-sound-vis" width="700" height="306"></canvas>
  <div id="progress-bar"><div id="progress"></div></div>
  <div id="player-controls-wrap">
    <div id="play-pause-btn" class="player-controls"></div>
    <div id="volume-btn" class="player-controls"></div>
    <div id="lang-select" class="player-controls"></div>
    <div id="player-info-wrap" class="player-controls">
      <div id="player-name" class="player-text"></div>
      <div id="player-date" class="player-text"></div>
      <div id="player-time" class="player-text"></div>
    </div>
  </div>
  <div id="volume-container"><input type="range" id="volume" min="0" max="100" step="1" value="1"/></div>
  <div id="lang-container"><div id="es-button" class="lang-button">Espanol</div><div id="en-button" class="lang-button">English</div></div>
</div>

<div id="welcome-pop-up" style="position:fixed; top:0px; left:0px; margin-left:0px;">
  <div id="welcome-header">Welcome to the Quipu Project!<div id="welcome-close-btn"></div></div>
  <div id="welcome-content"><p>The Quipu Project is a <a class="text-highlight">telephone line</a> and a <a class="text-highlight">website</a> recording oral testimonies from Peruvian women and men who were <a class="text-highlight">sterilised</a> as a result of a <a class="text-highlight">Government policy</a> in the late 1990s.  Overwhelmingly from poor or indigenous communities, many were forced, coerced, or not given enough information to <a class="text-highlight">decide</a> whether they wanted to be sterilised.</p>
<p>The Quipu Project is an emerging story about a <a class="text-highlight">quest for justice,</a> against the odds.  The quest is not over yet.  By listening to the testimonies and recording a message, <a class="text-highlight">you can help</a> to shape what happens next.</p>
    <div id="tour-btn" class="arrow-btn-right" style="position:relative; left:50%; margin-left:-90px; float:none;">Start listening</div>
  </div>
</div>

<?php print render($page['bottom']); ?>
