<?php

class MetaSQLOutput {
    protected $_parent = 0;

    function __construct( $parent = 0 ) {
        $this->_parent = $parent;
    }

    public function toString( $params, &$nBreaks = -1, &$isContinue = -1 ) {
        return '';
    } 

    public function getParent() {
        return $this->_parent;
    }
};

class MetaSQLString extends MetaSQLOutput {
    protected $_string = '';

    function __construct( $parent = 0, $str = '' ) {
        parent::__construct($parent);
        $this->_string = $str;
    }

    public function toString( $params, &$nBreaks = -1, &$isContinue = -1 ) {
        return $this->_string;
    }
};

define("FunctionUnknown", 0);
define("FunctionValue", 1);
define("FunctionLiteral", 2);
define("FunctionExists", 3);
define("FunctionReExists", 4);
define("FunctionIsFirst", 5);
define("FunctionIsLast", 6);
define("FunctionContinue", 7);
define("FunctionBreak", 8);
class MetaSQLFunction extends MetaSQLOutput {
    private $_valid = false;
    private $_noOutput = false;
    private $_func = FunctionUnknown;
    private $_params = array();
    private $_nBreaks = 0;

    function __construct( $parent, $func, $params ) {
        parent::__construct($parent);

        $this->_valid = 0;
        $this->_nBreaks = 0;
        $this->_noOutput = 0;

        $this->_params = $params;

        $this->_func = $this->identifyFunction($func);
        if($this->_func != FunctionUnknown) {
            switch($this->_func) {
                case FunctionValue:
                case FunctionLiteral:
                case FunctionExists:
                case FunctionReExists:
                case FunctionIsFirst:
                case FunctionIsLast:
                    $this->_valid = (count($this->_params) >= 1);
                    break;
                case FunctionContinue:
                case FunctionBreak:
                    $this->_valid = 1;
                    $this->_noOutput = 1;
                    if(count($params) >= 1)
                        $this->_nBreaks = (int)$params[0];
                    if($this->_nBreaks < 1) $this->_nBreaks = 1;
                    break;
                default:
            };
        }
    }

    public function isValid() {
        return $this->_valid;
    }

    public function type() {
        return $this->_func;
    }

    public function toString( $params, &$nBreaks = -1, &$isContinue = -1 ) {
        $v = $this->toVariant($params, $nBreaks, $isContinue);
        if($this->_noOutput) return '';
        if($this->_func==FunctionLiteral) {
            if(isset($v->value) || isset($v->type))
                return $v->value;
            else
                return $v;
        }
        if(isset($v->value) || isset($v->type)) {
            if(!empty($v->type)) {
                if(strtolower($v->type) == "null")
                    return "null";
                return "'" . pg_escape_string($v->value) . "'::" . $v->type;
            }
            $v = $v->value;
        }
        return "'" . pg_escape_string($v) . "'";
    }

    public function toVariant( $params, &$nBreaks = -1, &$isContinue = -1 ) {
        $trueVar  = (object)array("value" => true,  "type" => "bool");
        $falseVar = (object)array("value" => false, "type" => "bool");
        $nullVar  = (object)array("value" => null,  "type" => "null");

        $val = $falseVar;
        if($this->_valid) {
            $found = false;
            $str = '';
            $re = '';
            $t = '';
            $i = 0;
            switch($this->_func) {
                case FunctionValue:
                case FunctionLiteral:
                    $str = $this->_params[0];
                    if(isset($params->$str))
                    {
                        $val = $params->$str;
                        if(!isset($val->value) && !isset($val->type))
                            $val = (object)array("value" => $val);
                    }
                    else
                        $val = $nullVar;
                    if(is_array($val->value)) {
                        $str .= "__FOREACH_POS__";
                        $found = isset($params->$str);
                        $t = $params->$str;
                        if($found) {
                            $val = $val->value[$t];
                        } else {
                            // we are not in a loop or the loop we are in is not for
                            // this list so just return the first value in the list
                            $val = $val->value[0];
                        }
                        if(!isset($val->value))
                            $val = (object)array("value" => $val);
                    }
                    break;
                case FunctionExists:
                    $k = $this->_params[0];
                    $found = isset($params->$k);
                    if($found)
                        $val = $trueVar;
                    else
                        $val = $falseVar;
                    break;
                case FunctionReExists:
                    $re = $this->_params[0];
                    foreach($params as $key => $value) {
                        if(preg_match("/$re/", $key)) {
                            $val = $trueVar;
                            break;
                        }
                    }
                    break;
                case FunctionIsFirst:
                case FunctionIsLast:
                    $val = $falseVar;
                    $str = $this->_params[0];
                    $found = isset($params->$str);
                    $t = $params->$str;
                    if($found) {
                        if(is_array($t)) {
                            $str .= "__FOREACH_POS__";
                            $found = isset($params->$str);
                            $t2 = $params->$str;
                            $pos = 0;
                            if($found)
                                $pos = (int)$t2;

                            $l = $t;
                            if(count($l) > 0) {
                                if(($this->_func == FunctionIsFirst) && ($pos == 0)) $val = $trueVar;
                                else if(($this->_func == FunctionIsLast) && (($pos + 1) == count($l))) $val = $trueVar;
                            }
                        } else {
                            $val = $trueVar;
                        }
                    }
                    break;
                case FunctionContinue:
                case FunctionBreak:
                    if($nBreaks != -1 && $isContinue != -1) {
                        $nBreaks = $this->_nBreaks;
                        $isContinue = ($this->_func == FunctionContinue);
                    }
                    break;
                default:
                    // how did we get here?
            };
        }
        return $val;
    }

    protected function identifyFunction( $func ) {
        $f = strtolower(trim($func));
        if($f == "value")
            return FunctionValue;
        else if($f == "literal")
            return FunctionLiteral;
        else if($f == "exists")
            return FunctionExists;
        else if($f == "reexists")
            return FunctionReExists;
        else if($f == "isfirst")
            return FunctionIsFirst;
        else if($f == "islast")
            return FunctionIsLast;
        else if($f == "continue")
            return FunctionContinue;
        else if($f == "break")
            return FunctionBreak;

        return FunctionUnknown;
    }

};

define("MetaSQLBlock__BlockGeneric", -1);
define("MetaSQLBlock__BlockUnknown", 0);
define("MetaSQLBlock__BlockIf", 1);
define("MetaSQLBlock__BlockElseIf", 2);
define("MetaSQLBlock__BlockElse", 3);
define("MetaSQLBlock__BlockForEach", 4);
class MetaSQLBlock extends MetaSQLOutput {
    private $_valid = false;
    private $_block = false;

    private $_alt = false;
    private $_items = array();

    private $_loopVar = '';

    private $_if_not = false;
    private $_if_func = false;

    function __construct($parent, $cmd, $poptions) {
        parent::__construct($parent);
        
        $this->_valid = false;

        $this->_alt = 0;
        $this->_if_not = false;
        $this->_if_func = 0;

        $this->_block = $this->identifyBlock($cmd);
        if($this->_block != MetaSQLBlock__BlockUnknown) {
            $nw = "/[^\\w]/"; // will find the first non word character
            $i = -1;
            $in_list = 0;
	    $cmd = '';
            $options = '';
            $wip = '';
            $tmp = '';
            $plist = array();
            $qc = '';
            $string_starter = '';
            $enclosed = false;
            $working = false;
            $in_string = false;
            $p = 0;
            switch($this->_block) {
                case MetaSQLBlock__BlockGeneric:
                    $this->_valid = true;
                    break;
                case MetaSQLBlock__BlockIf:
                case MetaSQLBlock__BlockElseIf:
                    // hmmm the hard part ;)
                    // short solution to just get it to work.
                    // there is only one option and that is a single
                    // function call that returns true or false.
                    // with an optional NOT clause.
                    $wip = trim($poptions);
                    if(strtolower(substr($wip, 0, 4)) == "not ") {
                        $this->_if_not = true;
                        $wip = substr($wip, 4);
                    }

                    $i = -1;
                    if(preg_match($nw, $wip, $matches, PREG_OFFSET_CAPTURE)) {
                      $i = $matches[0][1];
                    }
                    if($i == -1) {
                        $cmd = $wip;
                        $options = '';
                    } else {
                        $cmd = substr($wip, 0, $i);
                        $options = substr($wip, $i);
                    }
                    $cmd = strtolower($cmd);
                    $options = trim($options);

                    if(!empty($options)) {
                        // first if we have a '(' then we will only parse out the information between it
                        // and the following ')'
                        $qc = $options[0];
                        $enclosed = false;
                        $working = !$enclosed;
                        $in_string = false;
                        $string_starter = '"';
                        $wip = '';
                        if($qc == '(') $enclosed = true;
                        $working = !$enclosed;
                        for($p = 0, $j = strlen($options); $p < $j; $p++) {
                            $qc = $options[$p];
                            if(!$working && $enclosed && $qc == '(') $working = true;
                            else {
                                if($in_string) {
                                    if($qc == '\\') {
                                        $wip .= $options[++$p];
                                    } else if($qc == $string_starter) {
                                        $in_string = false;
                                    } else {
                                        $wip .= $qc;
                                    }
                                } else {
                                    if($qc == ',') {
                                        $plist[] = $wip;
                                        $wip = '';
                                    } else if(strlen(trim($qc)) == 0) {
                                        // eat white space
                                    } else if($qc == '\'' || $qc == '"') {
                                        $in_string = true;
                                        $string_starter = $qc;
                                    } else if($enclosed && $qc == ')') {
                                        $working = false;
                                        break;
                                    } else {
                                        $wip .= $qc;
                                    }
                                }
                            }
                        }
                        if($wip != '') $plist[] = $wip;
                    }

                    $this->_if_func = new MetaSQLFunction($this->_parent, $cmd, $plist);
                    if(!$this->_if_func->isValid()) {
                        $this->_if_func = 0;
                    } else {
                        $this->_valid = true;
                    }

                    break;
                case MetaSQLBlock__BlockElse:
                    $this->_valid = true;
                    break;
                case MetaSQLBlock__BlockForEach:
                    $tmp = trim($poptions);
                    $wip = '';
                    $in_string = false;
                    $in_list = 0;
                    $string_starter = '"';
                    for($p = 0, $j = strlen($tmp); $p < $j; $p++) {
                        $qc = $tmp[$p];
                        if($in_string) {
                            if($qc == '\\') $wip .= $poptions[++$p];
                            else if($qc == $string_starter) $in_string = false;
                            else $wip .= $qc;
                        } else {
                            if($qc == '(') $in_list++;
                            else if($qc == ')') {
                                $in_list--;
                                if($in_list < 1) break;
                            } else if($qc == '\'' || $qc == '"') {
                                $in_string = true;
                                $string_starter = $qc;
                            } else if($qc == ',') break;
                            // everything else just... disapears?
                        }
                    }
                    if(!empty($wip)) {
                        $this->_loopVar = $wip;
                        $this->_valid = true;
                    }
                    break;
                default:
            };
        }
    }

    public function isValid() { return $this->_valid; }
    public function type() { return $this->_block; }

    public function append( $mso ) {
        if($mso) {
            $this->_items[] = $mso;
        }
    }

    public function setAlternate( $alt ) {
        $this->_alt = $alt;
    }

    public function toString( $params, &$nBreaks = -1, &$isContinue = -1 ) {
        $results = '';

        $output = 0;
        $b = false;
        $found = false;
        $myBreaks = 0;
        $myContinue = 0;
        $i = 0;
        $n = 0;
        $ii = 0;
        $list = array();
        $v = false;
        $t = false;
        $pList = array();
        $str = '';
        switch($this->_block) {
            case MetaSQLBlock__BlockIf:
            case MetaSQLBlock__BlockElseIf:
                $b = $this->_if_func->toVariant($params, $nBreaks, $isContinue);
                if(isset($b->value) || isset($b->type))
                  $b = $b->value;
                if($this->_if_not) $b = !$b;
                if($b) {
                    for($i = 0, $j = count($this->_items); $i < $j; $i++)
                    {
                        $output = $this->_items[$i];
                        $results .= $output->toString($params, $nBreaks, $isContinue);
                        if($nBreaks > 0) break;
                    }
                } else if($this->_alt) {
                    $results = $this->_alt->toString($params, $nBreaks, $isContinue);
                }
                break;

            case MetaSQLBlock__BlockForEach:
                $tvar = $this->_loopVar;
                $found = isset($params->$tvar);
                if($found) {
                    $v = $params->$tvar;
                    $list = $v;
                    for($i = 0, $j = count($list); $i < $j; $i++) {
                        $str = $this->_loopVar + "__FOREACH_POS__";

                        // create a new params list with our special var added in 
                        $pList = $params;
                        $pList->$str = i;

                        $myBreaks = 0;
                        $myContinue = 0;

                        // execute the block
                        for($ii = 0, $jj = count($this->_items); $ii < $jj; $ii++)
                        {
                            $output = $this->_items[$ii];
                            $results .= $output->toString($pList, $myBreaks, $myContinue);
                            if($myBreaks) break;
                        }

                        if($myBreaks > 0) {
                            $myBreaks--;
                            if($myBreaks > 0 || !$myContinue) {
                                if($nBreaks != -1) $nBreaks = $myBreaks;
                                if($isContinue != -1) $isContinue = $myContinue;
                                break;
                            }
                        }
                    }
                }
                break;

            case MetaSQLBlock__BlockElse:
            case MetaSQLBlock__BlockGeneric:
                for($i = 0, $j = count($this->_items); $i < $j; $i++)
                {
                    $output = $this->_items[$i];
                    $v = $output->toString($params, $nBreaks, $isContinue);
                    $results .= $v;
                    if($nBreaks > 0) break;
                }
                break;

            default:
        };

        return $results;
    }

    protected function identifyBlock( $block ) {
        $b = strtolower(trim($block));
        if($b == "generic")
            return MetaSQLBlock__BlockGeneric;
        else if($b == "if")
            return MetaSQLBlock__BlockIf;
        else if($b == "elseif")
            return MetaSQLBlock__BlockElseIf;
        else if($b == "else")
            return MetaSQLBlock__BlockElse;
        else if($b == "foreach")
            return MetaSQLBlock__BlockForEach;

        return MetaSQLBlock__BlockUnknown;
    }

};

class MetaSQLQueryPrivate { 
    public $_valid = false;
    public $_top = false;

    function __construct() {
        $this->_valid = false;
        $this->_top = false;
    }

    public function isValid() { return $this->_valid; }

    public function populate( $params ) {
        $sql = false;
        if($this->_top) {
            $sql = trim($this->_top->toString($params));
        }
        return $sql;
    }

    public function parse_query( $query ) {
        $this->_top = new MetaSQLBlock($this, "generic", '');
        $this->_blocks = array();
        $this->_blocks[] = $this->_top;
        $this->_current = $this->_top;

        $re = "/<\\?(.*)\\?>/U";
        $nw = "/[^\\w]/"; # will find the first non word character 

        $s = '';

        $lastPos = 0;
        $currPos = 0;
        while($currPos >= 0) {
            if(preg_match($re, $query, $matches, PREG_OFFSET_CAPTURE, $currPos)) {
                $currPos = $matches[0][1];
            } else {
                $currPos = -1;
            }
            if($lastPos != $currPos) {
                $this->_current->append(new MetaSQLString($this, substr($query, $lastPos, ($currPos==-1?strlen($query):$currPos)-$lastPos)));
            }
            if($currPos >= 0) {
                $s = trim($matches[1][0]);
                $i = -1;
                if(preg_match($nw, $s, $matches2, PREG_OFFSET_CAPTURE)) {
                  $i = $matches2[0][1];
                }
                $cmd = '';
                $options = '';
                if($i == -1) {
                    $cmd = $s;
                } else {
                    $cmd = substr($s, 0, $i);
                    $options = substr($s, $i);
                }
                $cmd = strtolower($cmd);

                if($cmd == "endif" || $cmd == "endforeach") {
                    $this->_block = $this->_current->type();
                    if( ($cmd == "endif" && (  $this->_block == MetaSQLBlock__BlockIf
                                            || $this->_block == MetaSQLBlock__BlockElseIf
                                            || $this->_block == MetaSQLBlock__BlockElse) )
                      || ($cmd == "endforeach" && ( $this->_block == MetaSQLBlock__BlockForEach ) ) ) {
                        array_pop($this->_blocks);
                        $this->_current = end($this->_blocks);
                    } else {
                        // uh oh! We encountered an end block tag when we were either not in a
                        // block or were in a block of a different type.
                        $this->_valid = false;
                        return false;
                    }
                } else if($cmd == "if" || $cmd == "foreach") {
                    // we have a control statement here and need to create a new block
                    $b = new MetaSQLBlock($this, $cmd, $options);
                    if($b->isValid()) {
                        $this->_current->append($b);
                        $this->_blocks[] = $b;
                        $this->_current = $b;
                    } else {
                        $this->_valid = false;
                        return false;
                    }
                } else if($cmd == "elseif" || $cmd == "else") {
                    // we need to switch up are if block to include this new alternate
                    if($this->_current->type() == MetaSQLBlock__BlockElse) {
                        $this->_valid = false;
                        return false;
                    } else if($this->_current->type() != MetaSQLBlock__BlockIf && $this->_current->type() != MetaSQLBlock__BlockElseIf) {
                        $this->_valid = false;
                        return false;
                    } else {
                        $b = new MetaSQLBlock($this, $cmd, $options);
                        if($b->isValid()) {
                            $this->_current->setAlternate($b);
                            array_pop($this->_blocks);
                            $this->_blocks[] = $b;
                            $this->_current = $b;
                        } else {
                            $this->_valid = false;
                            return false;
                        }
                    }
                } else {
                    // we must have a function... if not then i don't know what it could be.
                    // first we must parse the options into a list of parameters for the function
                    $options = trim($options);
                    $plist = array();
                    if(!empty($options)) {
                        // first if we have a '(' then we will only parse out the information between it
                        // and the following ')'
                        $qc = $options[0];
                        $enclosed = false;
                        $working = !$enclosed;
                        $in_string = false;
                        $string_starter = '"';
                        $wip = '';
                        if($qc == '(') $enclosed = true;
                        $working = !$enclosed;
                        for($p = 0, $j = strlen($options); $p < $j; $p++) {
                            $qc = $options[$p];
                            if(!$working && $enclosed && $qc == '(') {
                                $working = true;
                            } else {
                                if($in_string) {
                                    if($qc == '\\') {
                                        $wip .= $options[++$p];
                                    } else if($qc == $string_starter) {
                                        $in_string = false;
                                    } else {
                                        $wip .= $qc;
                                    }
                                } else {
                                    if($qc == ',') {
                                        $plist[] = $wip;
                                        $wip = '';
                                    } else if(strlen(trim($qc)) == 0) {
                                        // eat white space
                                    } else if($qc == '\'' || $qc == '"') {
                                        $in_string = true;
                                        $string_starter = $qc;
                                    } else if($enclosed && $qc == ')') {
                                        $working = false;
                                        break;
                                    } else {
                                        $wip .= $qc;
                                    }
                                }
                            }
                        }
                        if(!empty($wip)) $plist[] = $wip;
                    }

                    $f = new MetaSQLFunction($this, $cmd, $plist);
                    if($f->isValid()) {
                        $this->_current->append($f);
                    } else {
                        $this->_valid = false;
                        return false;
                    }
                }

                $currPos += strlen($matches[0][0]);
            }
            $lastPos = $currPos;
        }

        $this->_valid = true;
        return true;
    }

};

class MetaSQLQuery {
    private $_data = false;
    private $_source = '';

    function __construct( $query = '' ) {
        $this->_data = new MetaSQLQueryPrivate();
        $this->_source = '';

        if(!empty($query)) {
            $this->setQuery($query);
        }
    }

    public function setQuery( $query ) {
        $valid = false;
        if($this->_data) {
            $this->_source = $query;
            if($this->_data->_top) {
                $this->_data->_top = false;
                $this->_data->_valid = false;
            }
            $valid = $this->_data->parse_query($query);
        }
        return $valid;
    }

    public function isValid() {
        return ($this->_data !== false && $this->_data->isValid());
    }

    public function getSource() {
        return $this->_source;
    }

    public function toQuery( $params ) {
        $sql = false;
        if($this->isValid()) {
            $sql = $this->_data->populate($params);
        }
        return $sql;
    }
};

 ?>
