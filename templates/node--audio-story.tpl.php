<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>

<?php 
  $es = array();
  $en = array();
  $person = 'person'.$node->nid;
  if (array_key_exists('field_in', $content)) {
    $i = 0;
    $sub_set = array();
    $length = count($content['field_in']['#items']);
    while ($i < $length) {
      $sub = array('sub_in' => $content['field_in'][$i]['#markup'], 'sub_out' => $content['field_out'][$i]['#markup'], 'sub_text' => html_entity_decode($content['field_subtitle'][$i]['#markup']), ENT_QUOTES);
//  $sub = array((string)$i => (string)$i);
      $key = 'key'.(string)$i;
      $es[$key] = $sub;
      $i = $i + 1;
//    }
    }
  }

  if (array_key_exists('field_in_en',$content)) {
    $i = 0;
    $length_en = count($content['field_in_en']['#items']);
    while ($i < $length_en) {
      $sub_en = array('sub_in' => $content['field_in_en'][$i]['#markup'], 'sub_out' => $content['field_out_en'][$i]['#markup'], 'sub_text' => html_entity_decode($content['field_subtitle_en'][$i]['#markup']), ENT_QUOTES);
//    $sub = array((string)$i => (string)$i);
      $key = 'key'.(string)$i;
      $en[$key] = $sub_en;
      $i = $i + 1;
//    }
    }
  }
  $sub_set['es'] = $es;
  $sub_set['en'] = $en;
  drupal_add_js(array($person => $sub_set), 'setting');
      
//  dsm($content);
      
?>
<?php if ($status == 1 && $node->field_narrative_role['und'][0]['tid']==63): ?>
<article class="node-<?php print $node->nid; ?> <?php print $classes; ?> contributor clearfix"<?php print $attributes; ?>>
<?php endif; ?>
<?php if ($status == 1 && $node->field_narrative_role['und'][0]['tid']==62): ?>
<article class="node-<?php print $node->nid; ?> <?php print $classes; ?> audience clearfix"<?php print $attributes; ?>>
<?php endif; ?>
<?php if ($status == 0): ?>
<article class="node-<?php print $node->nid; ?> <?php print $classes; ?> notpublished clearfix"<?php print $attributes; ?>>        
<?php endif; ?>
  <?php if ($title_prefix || $title_suffix || $display_submitted || $unpublished || !$page && $title): ?>
    <header>
      <div class="play_button icon-phone" data-nid="<?php print $node->nid; ?>"></div>
      <div class="audio_story_title_wrap">
        <?php print render($title_prefix); ?>
      	<?php if (!$page && $title): ?>
	  <?php if (in_array('editor/moderator',$GLOBALS['user']->roles)): ?>
	    <div class="admin-title"><?php print render($title); ?></div>
	  <?php endif; ?>
          <h2<?php print $title_attributes; ?>><?php print render($content['field_name']); ?></h2>
      	<?php endif; ?>
      	<?php print render($title_suffix); ?>
      </div>
      <div class="audio_story_length">
        <?php
	  $mins = intval(intval($node->field_length['und'][0]['value'])/60);
	  $secs = intval(intval($node->field_length['und'][0]['value'])%60);
	  if (strlen($secs)<2) {
	    $secs = "0".strval($secs);
	  };
	  print strval($mins).":".strval($secs);
	?>
      </div>
      <div class="audio_story_time">
        <?php print render(date("g:i,a", $node->created)); ?>
      </div>
      <div class="audio_story_date">
        <?php print render(date("D,d m Y", $node->created)); ?>
      </div>
      <div id="subtitle-container-<?php print $node->nid; ?>" class="subtitle-container"></div>
    </header>
  <?php endif; ?>
  <div class="story_player">
    <?php
	// We hide the comments and links now so that we can render them later.
      hide($content['comments']);
      hide($content['links']);
      print render($content);
    ?>
  </div>
</article>